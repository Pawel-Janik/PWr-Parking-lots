import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { ParkingDetailComponent } from './parking-detail.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
      AppComponent,
      ParkingDetailComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
