import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';

@Injectable({ providedIn: 'root' })
export class AppService {

  public loading$ = new BehaviorSubject<boolean>(false);
  get loading(): boolean {
    return this.loading$.getValue();
  }
  set loading(value: boolean) {
    this.loading$.next(value);
  }

  public mobileView$ = new BehaviorSubject<boolean>(false);
  get mobileView(): boolean {
    return this.mobileView$.value;
  }
  set mobileView(value: boolean) {
    this.mobileView$.next(value);
  }

  get touchUI(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }

  constructor(public platform: Platform) { }

}
