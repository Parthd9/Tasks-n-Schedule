import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string, propName: string): unknown {
    if(value.length === 0 || filterString === '') {
      return value;
    }
    const result = [];
    for(const res of value) {
      if(res[propName].indexOf(filterString)!==-1) {
        result.push(res);
      }
    }
    return result;
  }

}
