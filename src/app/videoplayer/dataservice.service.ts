import { Injectable, Inject } from '@angular/core';

@Injectable()
export class Dataservice {
    private sharedData: any;

    setSharedData(data: any) {
        this.sharedData = data;
    }

    getSharedData() {
        return this.sharedData;
    }
}
