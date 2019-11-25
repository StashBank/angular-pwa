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
  MatTooltipModule,
} from '@angular/material';
import { PlatformModule } from '@angular/cdk/platform';

import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

import { CoreTranslateService } from './translate.service';
import { TimestampPipe } from './timestamp.pipe';
import { BooleanPipe } from './boolean.pipe';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/');
}

const dbConfig: DBConfig = {
  name: 'todoPosts', version: 1, objectStoresMeta: [
    {
      store: 'todo',
      storeConfig: { keyPath: 'key', autoIncrement: true },
      storeSchema: [
        // { name: 'posts', keypath: 'key', options: { unique: false } }
      ]
    }
  ]
};

const matModules = [
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
  MatTooltipModule,
  MatDialogModule,
];

@NgModule({
  declarations: [TimestampPipe, BooleanPipe, AlertDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ...matModules,

    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
    }),
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,

    ...matModules,

    PlatformModule,
    TimestampPipe,
    BooleanPipe,
    AlertDialogComponent,
  ],
  entryComponents: [
    AlertDialogComponent
  ],
  providers: [
    { provide: TranslateService, useClass: CoreTranslateService }
  ]
})
export class CoreModule { }
