import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';

@Injectable()
export class SplitPane {
  splitPaneState : boolean;
  constructor(public platform : Platform) {
    this.splitPaneState = false;
  }

  getSplitPane() {
    if (localStorage.getItem('userData')) {

      if (this.platform.width() > 900) {
        this.splitPaneState = true;
      } else {
        this.splitPaneState = false;
      }
    } else {
      this.splitPaneState = false;
    }
    return this.splitPaneState;
  }

}