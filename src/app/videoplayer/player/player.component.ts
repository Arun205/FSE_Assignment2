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
  }

  ngOnInit() {
    (<any>window).onYouTubeIframeAPIReady = () => {
      this.player = new (<any>window).YT.Player('ytplayer', {
        height: '100%',
        width: '100%',
        videoId: 'ucHRFkDjUgg',
        playerVars: {'autoplay': 1, 'rel': 0, 'controls': 2},
        events: {
          'onReady': () => {
          },
          'onStateChange': () => {
          }
        }
      });
    };

    console.log('ngOnInit');
  }

}
