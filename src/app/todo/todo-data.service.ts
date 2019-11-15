import { Injectable, NgZone } from '@angular/core';
import { TodoModel } from './todo.model';
import { DatabaseService } from '../database/database.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {

  constructor(private http: HttpClient) {}

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
    });
  }

  public update(id: string, dto: TodoModel): Observable<TodoModel> {
    return this.http.put<TodoModel>(`/api/todos/${id}`, {
      id,
      ...dto
    });
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

}
