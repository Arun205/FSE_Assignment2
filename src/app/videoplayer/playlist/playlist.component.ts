import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
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
    console.log('playlist');
    localStorage.setItem('videoDataLoaded', 'no');
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
      localStorage.setItem('videoDataLoaded', 'yes');
      const sharedData: SharedData = new SharedData();
      sharedData.videoDataLoaded = true;
      sharedData.currentVideo = 0;
      sharedData.videoChanged = false;
      for (const i in this.videos) {
        if (this.videos[i]) {
          const ytbaseurl = 'https://youtube.com/watch?v=';
          const videoId = (this.videos[i].url).slice(ytbaseurl.length);
          this.videos[i].thumbnailurl = 'https://img.youtube.com/vi/' + videoId + '/default.jpg';
          if (this.videos[i].lastPlayed) {
            sharedData.currentVideo = parseInt(i, 10);
            this.currentVideo = parseInt(i, 10);
            localStorage.setItem('currentVideo', i);
          }
        }
      }
      this.dataservice.setSharedData(sharedData);
      this.dataservice.sharedDataEmitter.emit(sharedData);
    })
    .catch(e => {
      localStorage.setItem('videoDataLoaded', 'no');
      const sharedData: SharedData = new SharedData();
      sharedData.videoDataLoaded = true;
      this.dataservice.setSharedData(sharedData);
      this.dataservice.sharedDataEmitter.emit(sharedData);
      console.log('error');
    });
  }

  videoSelected(video, rowNum) {
    this.videos[this.currentVideo].lastPlayed = false;
    const options1 = new RequestOptions;
    this.http.put(this.allvideos_url + '/' + this.videos[this.currentVideo].id + '/', this.videos[this.currentVideo], options1)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
    });

    localStorage.setItem('prevVideo', String(this.currentVideo));
    this.currentVideo = rowNum;
    localStorage.setItem('currentVideo', rowNum);
    const sharedData: SharedData = new SharedData();
    sharedData.videoDataLoaded = true;
    sharedData.currentVideo = rowNum;
    sharedData.videoChanged = true;
    this.dataservice.setSharedData(sharedData);
    this.dataservice.sharedDataEmitter.emit(sharedData);

    this.videos[this.currentVideo].lastPlayed = true;
    const options2 = new RequestOptions;
    this.http.put(this.allvideos_url + '/' + this.videos[this.currentVideo].id + '/', this.videos[this.currentVideo], options2)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
    });
  }
}
