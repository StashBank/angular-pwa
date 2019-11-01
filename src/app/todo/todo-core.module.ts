import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { CoreModule, HttpLoaderFactory } from '../core/core.module';
import { CoreTranslateService } from '../core/translate.service';


@NgModule({
  imports: [
    CoreModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
    }),
  ],
  exports: [
    CoreModule,
    TranslateModule,
  ],
  providers: [
    { provide: TranslateService, useExisting: CoreTranslateService }
  ]
})
export class TodoCoreModule { }
