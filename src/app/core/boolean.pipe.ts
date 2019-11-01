import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: any, ...args: any[]): any {
    const key = value ? 'common.yes' : 'common.no';
    const res = this.translate.instant(key);
    return res;
  }

}
