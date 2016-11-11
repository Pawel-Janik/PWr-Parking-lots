import { Component, Input } from '@angular/core';
import { Parking } from './parking';

@Component({
    selector: 'parking-detail',
    templateUrl: './template/parking-detail.component.html',
})
export class ParkingDetailComponent {
    @Input()
    parking: Parking;
}