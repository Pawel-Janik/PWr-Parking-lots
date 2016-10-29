import { Injectable } from '@angular/core';
import { Parking } from './parking';
import { PARKINGS } from './mock-parkings'

@Injectable()
export class ParkingService {
    getParkings(): Promise<Parking[]> {
        return Promise.resolve(PARKINGS);
    }

}