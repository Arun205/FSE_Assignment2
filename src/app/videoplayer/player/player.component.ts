import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Subscription } from 'rxjs';
import { Dataservice } from '../dataservice.service';
import { SharedData } from './../../models/shareddata.model';
import * as $ from 'jquery';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @Input() controlsEvent;
  dataSubscription: Subscription;
  player: any;
  videos: any;
  muted = false;
  prevAction = '';
  videoId = '';
  prevVideoId = '';

  constructor(private dataservice: Dataservice, private snackBar: MatSnackBar) {
    this.dataSubscription = this.dataservice.sharedDataEmitter.subscribe((sharedData: SharedData) => {
      console.log(sharedData);
      if (sharedData.action && this.prevAction != sharedData.action) {
        this.controls(sharedData.action);
        this.prevAction = sharedData.action;
      }
      if (sharedData.videoDataLoaded) {
        this.videos = JSON.parse(localStorage.getItem('videos'));
        const currVideoId = sharedData.currentVideo;
        console.log('this.videos', this.videos);
        console.log('currVideoId', this.videos[currVideoId]);
        this.videoId = this.videos[currVideoId].url;
        if (this.videoId != this.prevVideoId) {
          this.loadVideo();
        }
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
    const that = this;
    $(document).ready(function() {
      $(document).click(function() {
        console.log('jquery');
        that.onVideoControls();
      });
    });
  }

  loadVideo() {
    setTimeout((<any>window).onYouTubeIframeAPIReady = () => {
      this.player = new (<any>window).YT.Player('ytPlayer', {
        height: '100%',
        width: '100%',
        videoId: this.videoId,
        playerVars: { 'autoplay': 0, 'rel': 0, 'controls': 0, 'enablejsapi': 1 }
      });
    }, 0);
  }

  onVideoControls() {
    const state = this.player.getPlayerState();
    console.log('num', state);
    if (state == 1) {
      console.log('playing');
    }
    if (state == 2) {
      console.log('paused');
    }
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
