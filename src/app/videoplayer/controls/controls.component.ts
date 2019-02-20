import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Http, RequestOptions } from '@angular/http';
import { Dataservice } from '../dataservice.service';
import { SharedData } from './../../models/shareddata.model';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  @Output() controlsEvent = new EventEmitter;
  public editvideos_url = 'http://localhost:3000/dataservice';
  public dataSubscription: Subscription;
  public muted = false;
  public disablePause = true;
  public like = 0;
  public dislike = 0;
  public videos: any;
  public onScreenAction = false;

  constructor(private dataservice: Dataservice, private http: Http) {
    this.dataSubscription = this.dataservice.sharedDataEmitter.subscribe((sharedData: SharedData) => {
      console.log(sharedData);
      if (sharedData.videoDataLoaded == true) {
        this.getLikesDislikes();
      }
      if (sharedData.onScreenAction) {
        this.onScreenAction = true;
        this.controls(sharedData.action);
      }
    });
   }

  ngOnInit() {
  }

  getLikesDislikes() {
    this.videos = JSON.parse(localStorage.getItem('videos'));
    const currentVideo = localStorage.getItem('currentVideo');
    this.like = this.videos[currentVideo].likes;
    this.dislike = this.videos[currentVideo].dislikes;
    console.log('currentRow', currentVideo);
    console.log('like', this.videos[currentVideo].likes);
  }

  controls(action) {
    if (!this.onScreenAction) {
      const sharedData: SharedData = new SharedData();
      sharedData.action = action;
      this.dataservice.setSharedData(sharedData);
      this.dataservice.sharedDataEmitter.emit(sharedData);
    }

    if (this.onScreenAction) {
      this.onScreenAction = false;
    }

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
    if (action == 'like') {
      this.like = this.like + 1;
      this.videos = JSON.parse(localStorage.getItem('videos'));
      const currentVideo = localStorage.getItem('currentVideo');
      this.videos[currentVideo].dislikes = this.dislike;
      this.videos[currentVideo].likes = this.like;
      const options = new RequestOptions;
      this.http.put(this.editvideos_url + '/' + this.videos[currentVideo].id + '/', this.videos[currentVideo], options)
      .toPromise()
      .then((res) => res.json())
      .then((data) => {
      });
    }
    if (action == 'dislike') {
      this.dislike = this.dislike + 1;
      this.videos = JSON.parse(localStorage.getItem('videos'));
      const currentVideo = localStorage.getItem('currentVideo');
      this.videos[currentVideo].likes = this.like;
      this.videos[currentVideo].dislikes = this.dislike;
      const options = new RequestOptions;
      this.http.put(this.editvideos_url + '/' + this.videos[currentVideo].id + '/', this.videos[currentVideo], options)
      .toPromise()
      .then((res) => res.json())
      .then((data) => {
      });
    }
  }

}
