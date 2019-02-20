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
  public currentVideo = 0;

  constructor(private http: Http, private dataservice: Dataservice) { }

  ngOnInit() {
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
      localStorage.setItem('videos', JSON.stringify(this.videos));
      for (const i in this.videos) {
        if (this.videos[i]) {
          const ytbaseurl = 'https://youtube.com/watch?v=';
          const videoId = (this.videos[i].url).slice(ytbaseurl.length);
          this.videos[i].thumbnailurl = 'https://img.youtube.com/vi/' + videoId + '/default.jpg';
        }
      }
      const sharedData: SharedData = new SharedData();
      sharedData.videoDataLoaded = true;
      sharedData.currentVideo = 0;
      sharedData.videoChanged = false;
      this.dataservice.setSharedData(sharedData);
      this.dataservice.sharedDataEmitter.emit(sharedData);
    });
  }

  videoSelected(video, rowNum) {
    localStorage.setItem('prevVideo', String(this.currentVideo));
    this.currentVideo = rowNum;
    localStorage.setItem('currentVideo', rowNum);
    const sharedData: SharedData = new SharedData();
    sharedData.videoDataLoaded = true;
    sharedData.currentVideo = rowNum;
    sharedData.videoChanged = true;
    this.dataservice.setSharedData(sharedData);
    this.dataservice.sharedDataEmitter.emit(sharedData);
  }
}
