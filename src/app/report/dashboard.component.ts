import { Component, ViewChild, OnInit } from '@angular/core';
import { ReportService } from 'app/service/report.service';
import { BaseChartDirective } from 'ng2-charts/charts/charts';
import { CommonService } from '../service/common.service';
//import * as Chart from 'chart.js';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  ngOnInit():void {
    this.initGraphs();
  }
  
  @ViewChild('timeBarChart') public timeBarChart: BaseChartDirective;
  @ViewChild('entryBarChart') public entryBarChart: BaseChartDirective;



  public barChartOptions: any;
  public barChartTypeV: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartTypeH: string = 'horizontalBar';

  // timeBarChart
  public timeBarChartColors:Array<any> ;
  public timeBarChartLabels: string[];
  public timeBarChartData: any[];
  

  // entryBarChart
  public entryBarChartLabels: string[];
  public entryBarChartData: any[];
  public entryBarChartColors: Array<any>;
  

  constructor(private reportService: ReportService, private commonService:CommonService) {
    
  }
  initGraphs(): void {
    this.barChartOptions = {
      scaleShowVerticalLines: false,      
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
    
    this.timeBarChartColors = [
      { // green
        backgroundColor: 'rgba(88, 227, 78, 0.9)',
        pointBackgroundColor: 'rgba(88, 227, 78, 0.9)',
        borderColor: 'rgba(18, 88, 13, 0.9)',
        pointHoverBorderColor: 'rgba(18, 88, 13, 0.9)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff'
      },
      { // red        
        backgroundColor: "rgba(251, 23, 23, 0.9)",
        pointBackgroundColor: 'rgba(251, 23, 23, 0.9)',
        borderColor: 'rgba(120, 1, 1, 0.9)',
        pointHoverBorderColor: 'rgba(120, 1, 1, 0.9)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff'

      }];
    this.entryBarChartColors = [
      { // green
        backgroundColor: 'rgba(88, 227, 78, 0.9)',
        pointBackgroundColor: 'rgba(88, 227, 78, 0.9)',
        borderColor: 'rgba(18, 88, 13, 0.9)',
        pointHoverBorderColor: 'rgba(18, 88, 13, 0.9)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff'
      }];
    this.setTimeBarChartData();
    this.setRecurringBarChartData();
  }
  // events
  public chartClicked(e: any): void {
    console.log(e);

  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public async changeDuration(duration: string) {
    
  }

  private setRecurringBarChartData() {
    
    this.entryBarChartLabels = ["John", "Smith", "Michael", "Jordan", "Tiger"];
    this.entryBarChartData = [
      {
        data: [65, 59, 40, 31, 26],
        label: this.commonService.getLocaleString("pageDashboard.totalVisit")
      }];
  }

  private setTimeBarChartData() {    
    
    this.timeBarChartLabels = ["08-01","08-02","08-03","08-04","08-05","08-06","08-07"];
    this.timeBarChartData = [
    {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: this.commonService.getLocaleString("pageDashboard.success")
    },
    {
      data: [28, 48, 40, 19, 86, 27, 90],
      label: this.commonService.getLocaleString("pageDashboard.exception")
    }];
  }

  timecodeToTimeString(timecode: number): string {
    if (timecode == null) return "";

    var date = new Date(timecode);
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return hour + ':' + minute;
  }
}
