import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoPageComponent } from './todo-page/todo-page.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TodoListComponent
  },
  {
    path: 'new',
    component: TodoPageComponent
  },
  {
    path: 'edit/:id',
    component: TodoPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
