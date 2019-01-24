import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Dataservice } from '../dataservice.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  @Output() controlsEvent = new EventEmitter;

  constructor(private dataservice: Dataservice) { }

  ngOnInit() {
  }

  controls(action) {
    this.dataservice.setSharedData(action);
    this.dataservice.sharedDataEmitter.emit(action);
  }

}
