import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NewsletterService } from '../newsletter/newsletter.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  AlertDialogComponent,
  AlertDialogButtonCode,
  AlertDialogData
} from '../core/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  readonly VAPID_PUBLIC_KEY = 'BD9dpwKNEoNjMWXIkszDWBXSLMZYe9JZX6UpHwrjiQLEKMZZKytOaRLZWvKKd2TKGDQU82enC6avKErHM9fpQRM';
  subscriberId: string;
  title: string;
  body: string;

  get touchUI(): boolean {
    return this.appService.touchUI;
  }

  get mobileView(): boolean {
    return this.appService.mobileView;
  }

  constructor(
    private appService: AppService,
    private swPush: SwPush,
    private newsletterService: NewsletterService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.subscriberId = localStorage.getItem('subscriber_id');
  }

  subscribe() {
    from(
      this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY})
    ).pipe(
      mergeMap(
        sub => this.newsletterService.addPushSubscriber(sub)
      ),
    ).subscribe(subscriber => {
      this.subscriberId = subscriber.id;
      localStorage.setItem('subscriber_id', subscriber.id);
    }, err => {
      console.error('Could not subscribe to notifications', err);
      alert(err.message);
    });
  }

  unsubscribe() {
    this.newsletterService.removePushSubscriber(this.subscriberId)
      .subscribe(() => {
        this.subscriberId = null;
        localStorage.removeItem('subscriber_id');
      }, err => console.error(err));
  }

  send() {
    this.newsletterService.send({
      title: this.title,
      body: this.body
    }, this.subscriberId).subscribe(
      res => res ? this.showAlert(res.message) : null,
      err => console.error(err)
    );
  }

  private showAlert(message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: '',
        message,
        buttons: [
          {
            buttonCode: AlertDialogButtonCode.Ok
          }
        ],
        type: null
      } as AlertDialogData
    });
    dialogRef.afterClosed().subscribe();
  }

}
