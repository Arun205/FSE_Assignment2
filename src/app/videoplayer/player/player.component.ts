import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dataservice } from '../dataservice.service';

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
  i = 0;

  constructor(private dataservice: Dataservice) {
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
    (<any>window).onYouTubeIframeAPIReady = () => {
      this.player = new (<any>window).YT.Player('ytPlayer', {
        height: '500px',
        width: '100%',
        videoId: 'hHMyZR87VvQ',
        playerVars: { 'autoplay': 0, 'rel': 0, 'controls': 0 },
        events: {
          'onReady': (event) => {
            console.log('Player is ready');
          },
          'onStateChange': (event) => {
            this.stateChanged();
          }
        }
      });
    };

  }

  controls(action) {
    let currentVolume = 0;
    let volume = 0
    switch(action) {
      case 'play':
        this.player.playVideo();
        break;
      case 'pause':
        this.player.pauseVideo();
        break;
      case 'stop':
        this.player.stopVideo();
        break;
      case 'volumedown':
        currentVolume = this.player.getVolume();
        volume = 0;
        if (currentVolume > 1) {
          volume = currentVolume - 1;
        }
        this.player.setVolume(volume);
        break;
      case 'volumeup':
        currentVolume = this.player.getVolume();
        volume = 100;
        if (currentVolume < 100) {
          volume = currentVolume + 1;
        }
        this.player.setVolume(volume);
        break;
      case 'togglemute':
        this.muted = !this.muted;
        if (this.muted) {
          this.player.mute();
        } else {
          this.player.unmute();
        }
    }
  }

  stateChanged() {
    console.log('state changed');
    this.i = this.i + 1;
    console.log(this.i);
    this.player.setVolume(0);
    if ( this.i == 5) {
      this.player.setVolume(100);
    }
  }


}
