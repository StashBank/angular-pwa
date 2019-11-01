import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const seconds = value && value.seconds;
    const miliseconds = seconds && seconds * 1000;
    return seconds ? new Date(miliseconds) : null;
  }

}
