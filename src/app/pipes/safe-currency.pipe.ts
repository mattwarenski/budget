import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'safeCurrency'
})
export class SafeCurrencyPipe implements PipeTransform {
  static currencyPipe: CurrencyPipe = new CurrencyPipe("en");

  transform(value: any): any {
    let safeVal = value ? value : 0;
    safeVal = parseInt(safeVal.toString().replace(/[^\d.\-+]/, ''));
    return SafeCurrencyPipe.currencyPipe.transform(safeVal, 'USD', true, '1.2-2');
  }

}
