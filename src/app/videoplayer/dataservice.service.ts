import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class Dataservice {
    private sharedData: any;
    sharedDataEmitter: EventEmitter<any> = new EventEmitter<any>();

    setSharedData(data: any) {
        this.sharedData = data;
    }

    getSharedData() {
        return this.sharedData;
    }


}
