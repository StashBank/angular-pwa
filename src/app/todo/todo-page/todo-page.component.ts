import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { finalize, tap, filter } from 'rxjs/operators';

import { AppService } from 'src/app/app.service';
import { TodoDataService } from '../todo-data.service';
import { TodoModel } from '../todo.model';
import { Router, ActivatedRoute } from '@angular/router';
import { TimestampPipe } from 'src/app/core/timestamp.pipe';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.sass'],
  providers: [
    TimestampPipe
  ]
})
export class TodoPageComponent implements OnInit {

  id: string;
  srcItem: TodoModel;
  item: any;
  form: FormGroup;

  get saveButtonDisabled(): boolean {
    return this.form && (this.form.invalid || this.form.pristine);
  }

  constructor(
    private appSvc: AppService,
    private todoDataSvc: TodoDataService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private timestampPipe: TimestampPipe
  ) { }

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe(params => {
      const { id } = params;
      if (id) {
        this.id = id;
        setTimeout(() => this.loadItem());
      }
    });
  }

  onSaveClick() {
    this.save();
  }

  onDismissClick() {
    this.dismiss();
  }

  onBackClick() {
    this.back();
  }

  private initForm() {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      dateTo: new Date(),
      completed: false,
      completeDate: null
    });
    const completedCtrl = this.form.get('completed');
    completedCtrl.valueChanges.pipe(
      filter(() => !this.appSvc.loading)
    ).subscribe(value => {
      const completeDate = value ? new Date() : null;
      this.form.patchValue({
        completeDate
      }, { emitEvent: false });
    });
  }

  private loadItem() {
    if (!this.id) {
      return;
    }
    this.appSvc.loading = true;
    this.todoDataSvc.getById(this.id).pipe(
      finalize(() => this.appSvc.loading = false)
    ).subscribe(item => this.onItemLoaded(item));
  }

  private onItemLoaded(item: TodoModel) {
    this.srcItem = item;
    const { dateTo, completeDate }: any = item;
    this.item = {
      ...item,
      dateTo: this.timestampPipe.transform(dateTo),
      completeDate: this.timestampPipe.transform(completeDate),
    };
    this.form.patchValue(this.item);
    this.form.markAllAsTouched();
    this.form.markAsPristine();
  }

  private save() {
    this.appSvc.loading = true;
    this.getSaveQuery().pipe(
      finalize(() => this.appSvc.loading = false)
    )
    .subscribe();
  }

  private dismiss() {
      this.form.reset(this.item || {});
  }

  private back() {
    this.location.back();
  }

  private getSaveQuery(): Observable<any> {
    const dto = this.form.value;
    const query = this.id
      ? this.todoDataSvc.update(this.id, dto).pipe(tap(item => this.onItemLoaded(item)))
      : this.todoDataSvc.create(dto).pipe( tap(item => this.navigateToEdit(item.id)));
    return query;
  }

  private navigateToEdit(id: string) {
    this.router.navigate(['..', 'edit', id], { relativeTo: this.route, replaceUrl: true });
  }

}
