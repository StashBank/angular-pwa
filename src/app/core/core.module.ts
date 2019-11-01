import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  MatButtonModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  MatMenuModule,
  MatListModule,
  MatTableModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatGridListModule,
  MatSelectModule,
  MatDialogModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatCheckboxModule,
} from '@angular/material';
import { PlatformModule } from '@angular/cdk/platform';

import { CoreTranslateService } from './translate.service';
import { TimestampPipe } from './timestamp.pipe';
import { BooleanPipe } from './boolean.pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/');
}

@NgModule({
  declarations: [TimestampPipe, BooleanPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatSortModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    PlatformModule,
    TimestampPipe,
    BooleanPipe,
  ],
  providers: [
    { provide: TranslateService, useClass: CoreTranslateService }
  ]
})
export class CoreModule { }
