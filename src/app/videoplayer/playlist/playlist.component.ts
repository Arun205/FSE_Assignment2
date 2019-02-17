import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { VideoData } from './../../models/videodata.model';
import { Dataservice } from '../dataservice.service';
import { SharedData } from './../../models/shareddata.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  public allvideos_url = 'http://localhost:3000/dataservice';
  public videos: VideoData[];
  public imagepath = '';

  constructor(private http: Http, private dataservice: Dataservice) { }

  ngOnInit() {
    this.imagepath = 'https://img.youtube.com/vi/hHMyZR87VvQ/default.jpg';
    this.http.get(this.allvideos_url)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
      const allvideos = data;
      this.videos = [];
      for (const i in allvideos) {
        if (allvideos[i].status == 'Approved') {
          this.videos.push(allvideos[i]);
        }
      }
      console.log(this.videos);
      localStorage.setItem('videos', JSON.stringify(this.videos));
      const sharedData: SharedData = new SharedData();
      sharedData.videoDataLoaded = true;
      sharedData.currentVideo = 0;
      this.dataservice.setSharedData(sharedData);
      this.dataservice.sharedDataEmitter.emit(sharedData);
    });
  }
}
