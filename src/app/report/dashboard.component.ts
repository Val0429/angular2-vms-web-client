import { Component, ViewChild, OnInit, SimpleChanges, NgZone } from '@angular/core';
import { ReportService } from 'app/service/report.service';
import { BaseChartDirective } from 'ng2-charts/charts/charts';
import { CommonService } from '../service/common.service';
import { ReportStatistic } from '../Interface/interface';
//import * as Chart from 'chart.js';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  data:ReportStatistic[];
  
  @ViewChild('timeBarChart') public timeBarChart: BaseChartDirective;
  @ViewChild('entryBarChart') public entryBarChart: BaseChartDirective;

  end : Date;  
  start : Date;

  public barChartOptions: any;
  public barChartTypeV: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartTypeH: string = 'horizontalBar';

  // timeBarChart
  public timeBarChartColors:Array<any> ;
  public timeBarChartLabels: string[];
  public timeBarChartDatasets: any[];
  

  // entryBarChart
  public entryBarChartLabels: string[];
  public entryBarChartData: any[];
  public entryBarChartColors: Array<any>;
  

  constructor(private reportService: ReportService, private commonService:CommonService) {
    
    this.data = [];  

    let now : Date= new Date(Date.now());    
    
    this.start = new Date(now.getFullYear(), now.getMonth(), 1);    
    //init fist data, chart will not work without it
    let first  = new ReportStatistic();
    first.date = this.start .getFullYear()+"-"+(this.start .getMonth()+1)+"-"+this.start .getDate();
    first.totalException=0;
    first.totalVisitor=0;

    this.data.push(first);
    
    this.initGraphs();
  }


  async ngOnInit(){   
    let now = new Date(Date.now());    
    this.start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.end = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);    
    await this.updateCharts();
  }


  private async updateCharts() {
    //get success data
    var sucessResult = await this.reportService.getStatistic(this.start, this.end, ["AsI5cbTOm6"]);
    //copy result
    this.data = Object.assign([], sucessResult);
    //merge with failed data
    var failedResult = await this.reportService.getException(this.start, this.end, ["AsI5cbTOm6"]);
    for (let stat of failedResult) {
      let existsIndex = this.data.map(function (e) { return e.date; }).indexOf(stat.date);
      if (existsIndex > -1) {
        this.data[existsIndex].totalException = stat.totalException;
      }
      else {
        stat.totalVisitor = 0;
        this.data.push(stat);
      }
    }
    console.log(this.data);
    this.setTimeBarChartData();
    this.timeBarChart.chart.update();
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
    let now = new Date(Date.now());    
    this.end = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);    
    switch(duration){
      case "day":
        this.start = new Date(now.getFullYear(), now.getMonth(), now.getDate());            
        break;
      case "week":
        let newDate = now.getDate()-7;
        this.start.setDate(newDate>0?newDate:1);
        break;
      default:
        this.start = new Date(now.getFullYear(), now.getMonth(), 1);        
        break;
    }
    this.updateCharts();
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
        
    this.timeBarChartLabels = this.data.map(function(e){return e.date});
    this.timeBarChartDatasets = [
    {
        data: this.data.map(function(e){return e.totalVisitor}),
        label: this.commonService.getLocaleString("pageDashboard.success")
    },
    {
      data: this.data.map(function(e){return e.totalException}),
      label: this.commonService.getLocaleString("pageDashboard.exception")
    }];
  }

}
