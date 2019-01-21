import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { PlayerComponent } from './videoplayer/player/player.component';
import { ControlsComponent } from './videoplayer/controls/controls.component';
import { PlaylistComponent } from './videoplayer/playlist/playlist.component';
import { AddvideoComponent } from './addvideo/addvideo.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoplayerComponent,
    PlayerComponent,
    ControlsComponent,
    PlaylistComponent,
    AddvideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
