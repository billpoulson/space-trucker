import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ClockSignal extends Subject<number> {
  constructor() {
    super();
  }
}
