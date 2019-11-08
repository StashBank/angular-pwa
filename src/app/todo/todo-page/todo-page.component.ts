import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppService } from 'src/app/app.service';
import { TodoDataService } from '../todo-data.service';
import { TodoModel } from '../todo.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsletterService } from 'src/app/newsletter/newsletter.service';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.sass'],
})
export class TodoPageComponent implements OnInit {

  id: string;
  srcItem: TodoModel;
  item: any;
  form: FormGroup;

  get saveButtonDisabled(): boolean {
    return this.form && (this.form.invalid || this.form.pristine);
  }

  get touchUI(): boolean {
    return this.appSvc.touchUI;
  }

  constructor(
    private appSvc: AppService,
    private todoDataSvc: TodoDataService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private newsletterService: NewsletterService,
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
    this.todoDataSvc.getById(this.id).pipe(
    ).subscribe(item => this.onItemLoaded(item));
  }

  private onItemLoaded(item: TodoModel) {
    if (item) {
      this.srcItem = item;
      this.item = item;
      this.form.patchValue(this.item);
      this.form.markAllAsTouched();
      this.form.markAsPristine();
    }
  }

  private save() {
    const getNotificationMessage = todo => this.id
      ? `TODO "${todo.title}" updated`
      : `New TODO created "${todo.title}"`;
    this.getSaveQuery().pipe(
    ).subscribe(todo => this.sendNotification(
      'Todo',
      getNotificationMessage(todo),
      { id: todo.id },
      [{ action: 'go', title: 'Go'}]
    ));
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

  private sendNotification(title, body, data?, actions?) {
    const senderId = localStorage.getItem('subscriber_id');
    this.newsletterService.send({ title, body, data, actions }, senderId)
    .subscribe(
      _ => null,
      err => console.error(err)
    );
  }

}
