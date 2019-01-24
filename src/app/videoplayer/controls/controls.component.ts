import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  @Output() controlsEvent = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  play() {
    this.controlsEvent.emit('controlEvent');
    console.log('clicked');
  }

}
