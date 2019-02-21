import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dataservice } from './dataservice.service';
import { SharedData } from './../models/shareddata.model';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.css']
})
export class VideoplayerComponent implements OnInit {
  public dataSubscription: Subscription;
  public controlsEvent: string;
  public sharedData: SharedData;
  public title = '';
  public serverError = false;

  constructor(private dataservice: Dataservice) {
    this.dataSubscription = this.dataservice.sharedDataEmitter.subscribe((sharedData: SharedData) => {
      if (localStorage.getItem('videoDataLoaded')) {
        const videoDataLoaded = localStorage.getItem('videoDataLoaded');
        console.log('vdo loaded', videoDataLoaded);
        if (videoDataLoaded == 'yes') {
          const videos = JSON.parse(localStorage.getItem('videos'));
          const currentVideo = JSON.parse(localStorage.getItem('currentVideo'));
          this.title = videos[currentVideo].title;
        } else {
          this.serverError = true;
        }
      } else {
        this.serverError = true;
      }
    });
  }

  ngOnInit() {
    // if (localStorage.getItem('videoDataLoaded')) {
    //   const videoDataLoaded = localStorage.getItem('videoDataLoaded');
    //   if (videoDataLoaded == 'true') {
    //     const videos = JSON.parse(localStorage.getItem('videos'));
    //     const currentVideo = JSON.parse(localStorage.getItem('currentVideo'));
    //     this.title = videos[currentVideo].title;
    //   } else {
    //     this.serverError = true;
    //   }
    // } else {
    //   this.serverError = true;
    // }
  }

}
