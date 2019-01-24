import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material';

import { VideoData } from './../models/videodata.model';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 500,
  touchendHideDelay: 500,
};

@Component({
  selector: 'app-addvideo',
  templateUrl: './addvideo.component.html',
  styleUrls: ['./addvideo.component.css'],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ]
})
export class AddvideoComponent implements OnInit {

  videodata: any;
  public allvideos_url = 'http://localhost:3000/dataservice';
  public videos: VideoData[];
  public editEnabled = false;
  public showVideoList = false;
  public newvideotitle = '';
  public newvideourl = '';

  constructor(private http: Http, private snackBar: MatSnackBar)  { }

  ngOnInit() {
    this.getVideodata();
  }

  getVideodata() {
    this.http.get(this.allvideos_url)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
      this.videos = data;
      console.log(this.videos);
      this.showVideoList = true;
    });
  }

  addVideo() {
    const validationPassed = this.validation();
    if (validationPassed) {
      const options = new RequestOptions;
      const newVideo = new VideoData;
      if (this.videos.length == 0) {
        newVideo.id = 0;
      } else {
        newVideo.id = this.videos[this.videos.length - 1].id + 1;
      }
      newVideo.title = this.newvideotitle;
      newVideo.url = this.newvideourl;
      newVideo.status = 'Validation Pending';
      newVideo.approved = false;
      newVideo.likes = 0;
      newVideo.unlikes = 0;
      newVideo.currentStatus = '';
      newVideo.exitTime = 0;
      newVideo.edit = false;
      this.http.post(this.allvideos_url, newVideo, options)
      .toPromise()
      .then((res) => res.json())
      .then((data) => {
        this.getVideodata();
      });
      this.openSnackBar('Video Added!');
      this.newvideotitle = '';
      this.newvideourl = '';
    }
  }

  validation() {
    if (this.newvideotitle.trim().length == 0 && this.newvideourl.trim().length == 0) {
      this.openSnackBar('Video title and url cannot left blank');
      return false;
    }
    else {
      if (this.newvideotitle.trim().length == 0) {
        this.openSnackBar('Video title cannot left blank');
        return false;
      }
      if (this.newvideourl.trim().length == 0) {
        this.openSnackBar('Video url cannot left blank');
        return false;
      }
    }
    return true;
  }

  enableEdit(video) {
    console.log(video);
    video.edit = true;
  }

  validateVideo(video) {
    video.status = 'Approval Pending';
    this.editEnabled = false;
    const puturl = this.allvideos_url + '/' + video.id;
    this.http.put(puturl, video)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
      this.getVideodata();
    });
  }

  updateVideo(video) {
    video.edit = false;
    video.status = 'Validation Pending';
    const puturl = this.allvideos_url + '/' + video.id;
    this.http.put(puturl, video)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
      this.getVideodata();
    });
  }

  cancelUpdate(video) {
    video.edit = false;
  }

  approveVideo(video) {
    if (video.status == 'Validation Pending') {
      this.openSnackBar('Video needs to be validated');
    }

    if (video.status == 'Approved') {
      this.openSnackBar('Video already approved');
    }

    if (video.status == 'Approval Pending' ) {
      this.openSnackBar('Video Approved');
      video.status = 'Approved';
      this.editEnabled = false;
      const puturl = this.allvideos_url + '/' + video.id;
      this.http.put(puturl, video)
      .toPromise()
      .then((res) => res.json())
      .then((data) => {
        this.getVideodata();
      });
    }
  }

  deleteVideo(id: any) {
    const deleteurl = this.allvideos_url + '/' + id;
    this.http.delete(deleteurl)
    .toPromise()
    .then((res) => res.json())
    .then((data) => {
      this.getVideodata();
    });
  }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1500;
    config.panelClass = ['snackbarinfo'];
    this.snackBar.open(message, '', config);
  }
}
