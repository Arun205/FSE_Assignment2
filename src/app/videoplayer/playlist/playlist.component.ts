import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { VideoData } from './../../models/videodata.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  public allvideos_url = 'http://localhost:3000/dataservice';
  public videos: VideoData[];

  constructor(private http: Http) { }

  ngOnInit() {
    this.http.get(this.allvideos_url)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
      const allvideos = data;
      this.videos = [];
      for (let i in allvideos) {
        if (allvideos[i].status == 'Approved') {
          this.videos.push(allvideos[i]);
        }
      }
      console.log(this.videos);
    });
  }
}
