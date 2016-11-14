import {Component, Input, OnInit} from '@angular/core';
import {ChartPoint} from "./chart-point";

// webpack html imports
let template = require('./template/history-chart.html');

@Component({
    selector: 'history-chart',
    template: template
})
export class HistoryChartComponent implements OnInit {
    @Input()
    public chart: Array<ChartPoint>;
    // lineChart
    public lineChartData:Array<any> = [
        []
    ];
    public lineChartLabels:Array<any> = [];
    public lineChartType:string = 'line';
    public lineChartLegend:boolean = false;
    public lineChartOptions:any = {
        scales: {
            yAxes: [{
                ticks: {
                    /*
                    max: 5,
                    min: 0,
                    stepSize: 0.5
                    */
                }
            }]
        }
    };


    ngOnInit(): void {
        var i = 0;
        for (var item of this.chart) {
            if(i%20==0){
                this.lineChartData[0].push(item.places);
                this.lineChartLabels.push(item.time);
            }
            i++;
        }
        this.lineChartData[0].push(this.chart[this.chart.length-1].places);
        this.lineChartLabels.push(this.chart[this.chart.length-1].time);
    }
}