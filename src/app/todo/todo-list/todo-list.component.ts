import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { TodoModel } from '../todo.model';
import { TodoDataService } from '../todo-data.service';
import { Observable } from 'rxjs';
import { finalize, tap, map, filter } from 'rxjs/operators';

export class GridTodo extends TodoModel {
  position: number;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.sass']
})
export class TodoListComponent implements OnInit {

  todoList: GridTodo[];
  todoList$: Observable<GridTodo[]>;
  displayedColumns = ['position', 'title', 'dateTo', 'complete' ];

  constructor(
    private appSvc: AppService,
    private todoDataSvc: TodoDataService,
  ) { }

  ngOnInit() {
    setTimeout(() => this.loadItems(), 100);
  }

  loadItems() {
    this.appSvc.loading = true;
    this.todoList$ = this.todoDataSvc.getAll().pipe(
      finalize(() => this.appSvc.loading = false),
      filter(data => Array.isArray(data)),
      map(data => data.map((todo, index) => ({...todo, position: index + 1} as GridTodo))),
      tap(data => this.todoList = data),
    );
  }


}
