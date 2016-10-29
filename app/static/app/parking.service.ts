import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Parking } from './parking';
import { PARKINGS } from './mock-parkings'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ParkingService {
    private heroesUrl = 'api';  // URL to web api
    constructor(private http: Http) { }

    getParkings(): Promise<Parking[]> {
        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(this.heroesUrl)
            .toPromise()
            .then(response => response.json().data as Parking[])
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}