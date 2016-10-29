import { Component, Input } from '@angular/core';
import { Parking } from './parking';

@Component({
    selector: 'parking-detail',
    template: `
        <h2>Parking details</h2>
        <h3>id: {{parking.parking_id}}</h3>
        <h3>place_count: {{parking.place_count}}</h3>
    `
})
export class ParkingDetailComponent {
    @Input()
    parking: Parking;
}