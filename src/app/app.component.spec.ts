import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatIconModule,
  MatSelectModule,
  MatToolbarModule,
  MatListModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatSnackBarModule
} from '@angular/material';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { HttpLoaderFactory } from './core/core.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,

        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
        }),

        MatIconModule,
        MatSelectModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatSnackBarModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [

      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
