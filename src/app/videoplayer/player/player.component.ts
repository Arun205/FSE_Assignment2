import { Component, OnInit, AfterViewInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Subscription } from 'rxjs';
import { Dataservice } from '../dataservice.service';
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
  muted = false;

  constructor(private dataservice: Dataservice, private snackBar: MatSnackBar,
    private elementRef: ElementRef, private renderer: Renderer2) {
    this.dataSubscription = this.dataservice.sharedDataEmitter.subscribe((data: any) => {
      console.log(data);
      this.controls(data);
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
    setTimeout((<any>window).onYouTubeIframeAPIReady = () => {
      this.player = new (<any>window).YT.Player('ytPlayer', {
        height: '100%',
        width: '100%',
        videoId: 'hHMyZR87VvQ',
        playerVars: { 'autoplay': 0, 'rel': 0, 'controls': 0, 'enablejsapi': 1 }
      });
    }, 0);

    // this.elementRef.nativeElement.querySelector('#ytPlayer').listen(this.elementRef.nativeElement, 'click', (event) => {
    //   console.log('clicked');
    // });
    const that = this;
    $(document).ready(function() {
      $(document).click(function() {
        console.log('jquery');
        that.onVideoControls();
      });
      // $('#ytPlayer').click(function() {
      //   console.log('jquery');
      // });
    });
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
    }
  }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1500;
    config.panelClass = ['snackbarinfo'];
    this.snackBar.open(message, '', config);
  }
}
