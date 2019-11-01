import { NgModule } from '@angular/core';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { CoreModule } from '../core/core.module';
import { TodoPageComponent } from './todo-page/todo-page.component';
import { TodoCoreModule } from './todo-core.module';


@NgModule({
  declarations: [
    TodoListComponent,
    TodoDetailComponent,
    TodoPageComponent
  ],
  imports: [
    TodoCoreModule,
    TodoRoutingModule,
  ]
})
export class TodoModule { }
