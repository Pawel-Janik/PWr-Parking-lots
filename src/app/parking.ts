import {ChartPoint} from "./chart-point";
export class Parking {
	shortName: string;
	longName: string;
	pictureUrl: string;
    freePlaces: number;
    totalPlaces: number;
    measureTime: string;
    trend: number;
    parkingId: number;
    chart: Array<ChartPoint>;

}