import { Component, Input } from '@angular/core';
import { Parking } from './parking';

@Component({
    selector: 'parking-detail',
    templateUrl: 'app/template/parking-detail.component.html',


})
export class ParkingDetailComponent {
    @Input()
    parking: Parking;
}