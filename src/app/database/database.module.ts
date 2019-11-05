import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _Nedb from 'nedb';

declare global {
  const Nedb: typeof _Nedb;
}
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DatabaseModule {
}
