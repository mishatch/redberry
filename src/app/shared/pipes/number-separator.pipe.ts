import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSeparator',
  standalone: true
})
export class NumberSeparatorPipe implements PipeTransform {

  transform(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
