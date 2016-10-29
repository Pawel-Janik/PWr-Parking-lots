import { Component } from '@angular/core';
import { Parking } from './parking';

const PARKINGS: Parking[] =
    [
        {
            "place_count":129,
            "timestamp":"2016-10-29 08:58:01",
            "trend":-1,
            "parking_id":4
        },
        {
            "place_count":50,
            "timestamp":"2016-10-29 08:58:01",
            "trend":-1,
            "parking_id":2
        },
        {
            "place_count":232,
            "timestamp":"2016-10-29 08:58:03",
            "trend":-1,
            "parking_id":1
        }
    ];

@Component({
  selector: 'my-app',
  template: `<h1>My First Angular App</h1>
                <parking-detail [parking]="parking" *ngFor="let parking of parkings">
                </parking-detail>

             `
})

export class AppComponent {
    parkings = PARKINGS;
}

