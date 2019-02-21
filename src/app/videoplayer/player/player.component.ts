import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs';
import { Http, RequestOptions } from '@angular/http';
import { Dataservice } from '../dataservice.service';
import { SharedData } from './../../models/shareddata.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @Input() controlsEvent;
  public editvideos_url = 'http://localhost:3000/dataservice';
  dataSubscription: Subscription;
  player: any;
  videos: any;
  muted = false;
  prevAction = '';
  videoId = '';
  prevVideoId = '';
  changedVideo: boolean;
  currentTime = 0;
  videoDuration = 0;
  videoPlaying = false;
  playedTime = 0;
  videoTimer = timer(0, 1000);
  resumeTime = 0;
  holdCurrentTime = 0;

  constructor(private dataservice: Dataservice, private snackBar: MatSnackBar, private http: Http) {
    this.dataSubscription = this.dataservice.sharedDataEmitter.subscribe((sharedData: SharedData) => {
      if (sharedData.action && this.prevAction != sharedData.action) {
        this.controls(sharedData.action);
        this.prevAction = sharedData.action;
      }
      if (sharedData.videoDataLoaded) {
        this.videos = JSON.parse(localStorage.getItem('videos'));
        const currVideoId = sharedData.currentVideo;
        const ytbaseurl = 'https://youtube.com/watch?v=';
        this.videoId = (this.videos[currVideoId].url).slice(ytbaseurl.length);
        if (this.videoId != this.prevVideoId && !sharedData.videoChanged) {
          this.loadVideo();
          const currVideo = localStorage.getItem('currentVideo');
          this.currentTime = this.videos[currVideo].exitTime;
        }
        if (this.videoId != this.prevVideoId && sharedData.videoChanged) {
          this.changedVideo = sharedData.videoChanged;
          this.videoChanged();
        }
        this.prevVideoId = this.videoId;
      }
    });
   }

  ngAfterViewInit() {
      const doc = (<any>window).document;
      const playerApiScript = doc.createElement('script');
      playerApiScript.type = 'text/javascript';
      playerApiScript.src = 'https://www.youtube.com/iframe_api';
      doc.body.appendChild(playerApiScript);
  }

  ngOnInit() {
    const subscribe = this.videoTimer.subscribe(val => {
      if (this.videoPlaying) {
        this.resumeTime = this.resumeTime + 1;
        this.currentTime = this.resumeTime / this.videoDuration * 100;
      }
    });
  }

  sliderChanged() {
    const seekTime = this.currentTime / 100 * this.videoDuration;
    this.player.seekTo(seekTime);
    this.resumeTime = seekTime;
  }
  loadVideo() {
    setTimeout((<any>window).onYouTubeIframeAPIReady = () => {
      this.player = new (<any>window).YT.Player('ytPlayer', {
        videoId: this.videoId,
        playerVars: { 'autoplay': 0, 'rel': 0, 'controls': 0, 'enablejsapi': 1 },
        events: {
          'onReady': (event) => {
            console.log('Player is ready');
          },
          'onStateChange': (event) => {
            this.playerStateChange();
          }
        }
      });
    }, 0);
  }

  videoChanged() {
    const elapsedTime = this.player.getCurrentTime();
    console.log('elaplsed Time', elapsedTime);
    this.videos = JSON.parse(localStorage.getItem('videos'));
    const prevVideo = localStorage.getItem('prevVideo');
    const currentVideo = localStorage.getItem('currentVideo');
    this.resumeTime = this.videos[currentVideo].exitTime;
    this.videos[prevVideo].exitTime = elapsedTime;
    localStorage.removeItem('videos');
    localStorage.setItem('videos', JSON.stringify(this.videos));
    console.log('prev ', this.videos[prevVideo]);
    const options = new RequestOptions;
      this.http.put(this.editvideos_url + '/' + this.videos[prevVideo].id + '/', this.videos[prevVideo], options)
      .toPromise()
      .then((res) => res.json())
      .then((data) => {
      });
    this.player.cueVideoById({videoId: this.videoId, startSeconds: this.resumeTime});
    this.player.playVideo();
  }

  playerReady() {
    console.log('player ready');
  }

  playerStateChange() {
    if (this.player && !this.changedVideo) {
      let action = '';
      const state = this.player.getPlayerState();
      console.log('state' , state);
      if (state == 1) {
        this.videoPlaying = true;
        console.log('playing');
        this.videoDuration = this.player.getDuration();
        action = 'play';
      } else {
        this.videoPlaying = false;
      }
      if (state == 2) {
        console.log('paused');
        action = 'pause';
      }
      if (state == 1 || state == 2) {
        const sharedData: SharedData = new SharedData();
        sharedData.action = action;
        sharedData.onScreenAction = true;
        this.dataservice.setSharedData(sharedData);
        this.dataservice.sharedDataEmitter.emit(sharedData);
      }
    }
    this.changedVideo = false;
  }

  controls (action: any) {
    let currentVolume = 0;
    let volume = 0;
    switch (action) {
      case 'play':
        this.player.playVideo();
        this.openSnackBar('Video Playing');
        break;
      case 'pause':
        this.player.pauseVideo();
        this.openSnackBar('Video Paused');
        break;
      case 'stop':
        this.player.stopVideo();
        this.openSnackBar('Video Stopped');
        break;
      case 'volumedown':
        currentVolume = this.player.getVolume();
        volume = 0;
        if (currentVolume > 1) {
          volume = currentVolume - 1;
        }
        this.player.setVolume(volume);
        this.openSnackBar('Volume: ' + volume);
        break;
      case 'volumeup':
        currentVolume = this.player.getVolume();
        volume = 100;
        if (currentVolume < 100) {
          volume = currentVolume + 1;
        }
        this.player.setVolume(volume);
        this.openSnackBar('Volume: ' + volume);
        break;
      case 'togglemute':
        this.muted = !this.muted;
        console.log(this.muted);
        if (this.muted) {
          this.player.mute();
          this.openSnackBar('Muted');
        } else {
          this.player.unMute();
          this.openSnackBar('Unmuted');
        }
        break;
        case 'reload':
        this.player.seekTo(0);
        this.openSnackBar('Reloaded');
        break;
    }
  }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1500;
    config.panelClass = ['snackbarinfo'];
    this.snackBar.open(message, '', config);
  }
}
