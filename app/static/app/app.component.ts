import { Component } from '@angular/core';
import { Parking } from './parking';
import { ParkingService } from './parking.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1>My First Angular App</h1>
                <parking-detail [parking]="parking" *ngFor="let parking of parkings">
                </parking-detail>

            `,
    providers: [ParkingService]

})

export class AppComponent implements OnInit {
    constructor(private parkingService: ParkingService) { }

    ngOnInit(): void {
        this.getParkings();
    }

    parkings: Parking[];

    getParkings(): void {
        this.parkingService.getParkings().then(heroes => this.parkings = heroes);
    }

}

