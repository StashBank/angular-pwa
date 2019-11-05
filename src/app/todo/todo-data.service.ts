import { Injectable, NgZone } from '@angular/core';
import { TodoModel } from './todo.model';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService extends DatabaseService<TodoModel> {

  constructor(ngZone: NgZone) {
    super('todos', ngZone);
  }

}
