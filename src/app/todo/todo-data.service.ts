import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { TodoModel } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService extends FirebaseService<TodoModel> {

  protected collectionName = 'todos';

}
