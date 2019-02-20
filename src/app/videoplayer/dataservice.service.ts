import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { SharedData } from './../models/sharedData.model';

@Injectable({
    providedIn: 'root'
  })
export class Dataservice {
    private sharedData: SharedData;
    sharedDataEmitter: EventEmitter<any> = new EventEmitter<any>();

    setSharedData(data: SharedData) {
        this.sharedData = data;
    }

    getSharedData() {
        return this.sharedData;
    }

    appendSharedData(data) {
        for (const key in data) {
            if (key) {
                _.extend(this.sharedData, data);
            }
        }
    }
}
