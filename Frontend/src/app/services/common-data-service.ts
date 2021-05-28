import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable(
//   {
//   providedIn: 'root'
// }
)
export class CommonDataService {

  constructor() { }

  userData = new BehaviorSubject<any>(null);

  setData(data:any) {
    this.userData.next(data);
  }
}
