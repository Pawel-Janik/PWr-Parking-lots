import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { ParkingDetailComponent } from './parking-detail.component';
import { HttpModule }    from '@angular/http';
import { HistoryChartComponent } from './history-chart.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';


@NgModule({
  imports:      [
      BrowserModule,
      HttpModule,
      ChartsModule
  ],
  declarations: [
      AppComponent,
      ParkingDetailComponent,
      HistoryChartComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
