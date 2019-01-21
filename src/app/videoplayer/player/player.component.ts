import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  player: any;

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
        playerVars: { 'autoplay': 0, 'rel': 0, 'controls': 2 },
        events: {
          'onReady': (event) => {
            console.log('Player is ready');
          },
          'onStateChange': (event) => {
          }
        }
      });
    };

    console.log('ngOnInit');
  }

}
