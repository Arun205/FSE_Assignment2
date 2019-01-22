import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { AddvideoComponent } from './addvideo/addvideo.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path: '', component: VideoplayerComponent},
    {path: 'addvideo', component: AddvideoComponent}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
