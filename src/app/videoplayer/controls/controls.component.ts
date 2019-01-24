import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Dataservice } from '../dataservice.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  @Output() controlsEvent = new EventEmitter;
  public muted = false;
  public disablePause = true;

  constructor(private dataservice: Dataservice) { }

  ngOnInit() {
  }

  controls(action) {
    this.dataservice.setSharedData(action);
    this.dataservice.sharedDataEmitter.emit(action);
    if (action == 'togglemute') {
      this.muted = !this.muted;
    }
    if (action == 'play') {
      this.disablePause = false;
    }
    if (action == 'pause') {
      this.disablePause = true;
    }
    if (action == 'stop') {
      this.disablePause = true;
    }
    if (action == 'reload') {
      this.disablePause = false;
    }
  }

}
