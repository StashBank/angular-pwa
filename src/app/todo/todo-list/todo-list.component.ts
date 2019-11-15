import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { TodoModel } from '../todo.model';
import { TodoDataService } from '../todo-data.service';
import { Observable } from 'rxjs';
import { finalize, tap, map, filter } from 'rxjs/operators';

export class GridTodo extends TodoModel {
  position: number;
}

export class DisplayedColumnsSettings {
  actions: boolean;
  position: boolean;
  title: boolean;
  dateTo: boolean;
  completed: boolean;
  completeDate: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.sass']
})
export class TodoListComponent implements OnInit {

  todoList: GridTodo[];
  todoList$: Observable<GridTodo[]>;
  // displayedColumns = ['actions', 'position', 'title', 'dateTo', 'completed', 'completeDate' ];
  displayedColumns = [];
  settings = {
    displayedColumns: {
      actions: true,
      position: true,
      title: true,
      dateTo: true,
      completed: true,
      completeDate: true
    }
  };
  saveDisplayColumnsDisabled: boolean;

  constructor(
    private todoDataSvc: TodoDataService,
  ) { }

  ngOnInit() {
    this.resetDisplayedColumns();
    this.getSettings<DisplayedColumnsSettings>('displayedColumns')
      .pipe(
        filter(x => x !== null)
      )
      .subscribe(res => {
        this.settings.displayedColumns = res || {} as any;
        this.resetDisplayedColumns();
      }, e => console.error(e));
    this.loadItems();
  }

  onSaveDisplayColumnsClick() {
    this.saveDisplayColumnsDisabled = true;
    this.saveSettings<DisplayedColumnsSettings>('displayedColumns', this.settings.displayedColumns)
    .pipe(
      finalize(() => this.saveDisplayColumnsDisabled = false)
    )
    .subscribe(() => this.resetDisplayedColumns(), e => console.error(e));
  }

  private resetDisplayedColumns() {
    this.displayedColumns = Object.keys(this.settings.displayedColumns)
      .map(key => ({ key, value: this.settings.displayedColumns[key] }))
      .filter(x => x.value)
      .map(x => x.key);
  }

  private loadItems() {
    this.todoList$ = this.todoDataSvc.getAll().pipe(
      filter(data => Array.isArray(data)),
      map(data => data.map((todo, index) => ({...todo, position: index + 1} as GridTodo))),
      tap(data => {
        this.todoList = data || [];
      }),
    );
  }

  private saveSettings<T>(key: string, settings: T): Observable<any> {
    return this.todoDataSvc.setGridSetting<T>(key, settings);
  }

  private getSettings<T>(key: string): Observable<T> {
    return this.todoDataSvc.getGridSetting(key);
  }

}
