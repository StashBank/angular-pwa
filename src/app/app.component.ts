import { Component, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppService } from './app.service';
import { TranslateService } from '@ngx-translate/core';
import { CheckForUpdateService } from './app-check-for-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy {

  @ViewChild('snav', { read: MatSidenav, static: false }) snavRef: MatSidenav;

  mobileQuery: MediaQueryList;
  fillerNav: Array<{ title: string, path: string }> = [
    { title: 'common.main-menu.home', path: 'home' },
    { title: 'common.main-menu.todo', path: 'todo' },
  ];

  private mobileQueryListener: (ev: MediaQueryListEvent) => void;

  get loading(): boolean {
    return this.appService.loading;
  }

  set loading(value: boolean) {
    this.appService.loading = value;
  }

  get newVersionAvailable$() {
    return this.appService.newVersionAvailable$;
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private snackBar: MatSnackBar,
    private appService: AppService,
    checkForUpdateSvc: CheckForUpdateService,
    translate: TranslateService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = _ => {
      changeDetectorRef.detectChanges();
      this.appService.mobileView$.next(this.mobileQuery.matches);
    };
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    translate.setDefaultLang('en');
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  navLinkClick() {
    if (this.mobileQuery.matches) {
      this.snavRef.close();
    }
  }

  onUpdateAppClick() {
    this.appService.installUpdates();
  }

}
