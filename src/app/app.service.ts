import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class AppService {

  public newVersionAvailable$ = new BehaviorSubject<boolean>(false);
  get newVersionAvailable(): boolean {
    return this.newVersionAvailable$.getValue();
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

  constructor(
    public platform: Platform,
    private updates: SwUpdate
  ) {
    updates.available.subscribe(event => this.newVersionAvailable$.next(true));
  }

  async installUpdates() {
    if (!this.updates.isEnabled) {
      return;
    }
    await this.updates.activateUpdate();
    document.location.reload();
  }

}
