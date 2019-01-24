import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatTooltipModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDividerModule,
  MatCardModule } from '@angular/material'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { Dataservice } from './videoplayer/dataservice.service';
import { PlayerComponent } from './videoplayer/player/player.component';
import { ControlsComponent } from './videoplayer/controls/controls.component';
import { PlaylistComponent } from './videoplayer/playlist/playlist.component';
import { AddvideoComponent } from './addvideo/addvideo.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoplayerComponent,
    PlayerComponent,
    ControlsComponent,
    PlaylistComponent,
    AddvideoComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule
  ],
  providers: [Dataservice],
  bootstrap: [AppComponent]
})
export class AppModule { }
