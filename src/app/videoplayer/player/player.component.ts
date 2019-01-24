import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Dataservice } from '../dataservice.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @Input() controlsEvent;
  player: any;
  i = 0;

  constructor() { }

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
