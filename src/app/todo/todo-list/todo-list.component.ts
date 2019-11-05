import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  displayedColumns = [ 'actions', 'position', 'title', 'dateTo', 'completed' ];

  constructor(
    private todoDataSvc: TodoDataService,
  ) { }

  ngOnInit() {
    setTimeout(() => this.loadItems(), 100);
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


}
