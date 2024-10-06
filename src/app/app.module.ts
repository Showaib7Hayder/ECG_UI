import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { DahboardComponent } from './components/dahboard/dahboard.component';
import { UploadComponent } from './components/upload/upload.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts'


@NgModule({
  declarations: [
    AppComponent,
    DahboardComponent,
    UploadComponent,
    AnalyticsComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxFileDropModule,
    HttpClientModule,
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
