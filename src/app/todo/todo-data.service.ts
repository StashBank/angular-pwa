import { Injectable } from '@angular/core';
import { TodoModel } from './todo.model';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Guid } from 'guid-typescript';
import { MatSnackBar } from '@angular/material';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {

  get senderId(): string {
    return localStorage.getItem('subscriber_id');
  }

  constructor(
    private http: HttpClient,
    private matSnackbar: MatSnackBar,
    private idbService: NgxIndexedDBService
  ) {
    idbService.currentStore = 'todo';
  }

  public getAll(): Observable<TodoModel[]> {
    return this.http.get <TodoModel[]>('/api/todos');
  }

  public getById(id: string): Observable<TodoModel> {
    return this.http.get<TodoModel>(`/api/todos/${id}`);
  }

  public create(dto: TodoModel): Observable<TodoModel> {
    const id = Guid.create().toString();
    return this.http.post<TodoModel>('/api/todos', {
      id,
      ...dto
    }, {
      params: {
        senderId: this.senderId
      }
    });
  }

  public update(id: string, dto: TodoModel): Observable<TodoModel> {
    const url = `/api/todos/${id}`;
    const body = {
      id,
      ...dto
    };
    const options = {
      params: {
        senderId: this.senderId
      }
    };

    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      return from(
        this.storeToIndexDb(Guid.create().toString(), {
          method: 'PUT',
          url,
          body,
          options
        }))
        .pipe(
          concatMap(() => this.matSnackbar.open('Saving', 'Cancel', { duration: 3000 }).afterDismissed()),
          concatMap(() => navigator.serviceWorker.ready),
          map((sw) => {
            console.log('Scheduled new sync task');
            return sw.sync.register('sync-new-todo-posts');
          }),
          map(() => null)
        );
    } else {
      return this.http.put<TodoModel>(`/api/todos/${id}`, body, options);
    }
  }

  public remove(id: string): Observable<number> {
    return this.http.delete<number>(`/api/todos/${id}`);
  }

  public getGridSetting<T>(key: string): Observable<T> {
    return this.http.get<T>(`/api/todos/settings/${key}`);
  }

  public setGridSetting<T>(key: string, settings: T): Observable<T> {
    return this.http.post<T>(`/api/todos/settings/${key}`, settings);
  }

  private storeToIndexDb(key: string, data) {
    return this.idbService.add({ key, ...data});
  }

}
