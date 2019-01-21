import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path: '', component: VideoplayerComponent}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
