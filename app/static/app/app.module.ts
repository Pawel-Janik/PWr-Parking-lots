import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { ParkingDetailComponent } from './parking-detail.component';
import { HttpModule }    from '@angular/http';


@NgModule({
  imports:      [
      BrowserModule,
      HttpModule,
  ],
  declarations: [
      AppComponent,
      ParkingDetailComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
