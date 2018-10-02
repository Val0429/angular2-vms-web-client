import { Component, ViewChild, OnInit, SimpleChanges, NgZone } from '@angular/core';
import { ReportService } from 'app/service/report.service';
import { BaseChartDirective } from 'ng2-charts/charts/charts';
import { CommonService } from '../service/common.service';
import { ReportStatistic, KioskUser, RecurringVisitor, Visitor } from '../Interface/interface';
import { KioskService } from '../service/kiosk.service';
//import * as Chart from 'chart.js';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  statisticData:ReportStatistic[];
  recurringData:RecurringVisitor[];
  kiosks:KioskUser[];
  
  @ViewChild('timeBarChart') public timeBarChart: BaseChartDirective;
  @ViewChild('entryBarChart') public entryBarChart: BaseChartDirective;

  end : Date;  
  start : Date;

  public barChartOptions: any;
  public barChartTypeV: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartTypeH: string = 'horizontalBar';

  // timeBarChart
  public timeBarChartLabels: string[];
  public timeBarChartDatasets: any[];
  

  // entryBarChart
  public entryBarChartLabels: string[];  
  public entryBarChartDatasets: any[];
  

  constructor(private reportService: ReportService, private commonService:CommonService, private kioskService: KioskService) {
    this.recurringData = [];
    this.statisticData = [];  

    let now : Date= new Date(Date.now());    
    
    this.start = new Date(now.getFullYear(), now.getMonth(), 1);    
    //init fist data, chart will not work without it
    let first  = new ReportStatistic();
    first.date = this.start .getFullYear()+"-"+(this.start .getMonth()+1)+"-"+this.start .getDate();
    first.totalException=0;
    first.totalVisitor=0;

    this.statisticData.push(first);
    
    //init fist data, chart will not work without it
    let firstRecurring = new RecurringVisitor();    
    firstRecurring.visitor = new Visitor();
    firstRecurring.visitor.name="test";
    firstRecurring.totalVisit=0;
    this.recurringData.push(firstRecurring);

    this.initStatisticGraphs();
  }


  async ngOnInit(){   
    
    this.kiosks = await this.kioskService.read("&paging.all=true");    
    await this.changeDuration('month');
    this.recurringData = await this.reportService.getRecurringVisitors(this.start, this.end);
    this.setRecurringBarChartData();
    this.entryBarChart.chart.update();
    //console.log(this.recurringData);
  }


  private async updateCharts() {
    //get success data
    var sucessResult = await this.reportService.getStatistic(this.start, this.end, this.kiosks.map(function(e){ return e.objectId}));
    //copy result
    this.statisticData = Object.assign([], sucessResult);
    //merge with failed data
    var failedResult = await this.reportService.getException(this.start, this.end, this.kiosks.map(function(e){ return e.objectId}));
    for (let stat of failedResult) {
      let existsIndex = this.statisticData.map(function (e) { return e.date; }).indexOf(stat.date);
      if (existsIndex > -1) {
        this.statisticData[existsIndex].totalException = stat.totalException;
      }
      else {
        stat.totalVisitor = 0;
        this.statisticData.push(stat);
      }
    }
    //console.log(this.statisticData);
    this.setTimeBarChartData();
    this.timeBarChart.chart.update();
  }

  initStatisticGraphs(): void {
    this.barChartOptions = {
      scaleShowVerticalLines: false,      
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {if (value % 1 === 0) {return value;}}
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {if (value % 1 === 0) {return value;}}
          }
        }]
      }
    };
    
    
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
    
    this.entryBarChartLabels = [this.commonService.getLocaleString("pageDashboard.recurringVisitor")];    
    
    this.entryBarChartDatasets = this.recurringData.map(function(e){ return { label : e.visitor.name, data : [e.totalVisit]}});
    
  }

  private setTimeBarChartData() {    
        
    this.timeBarChartLabels = this.statisticData.map(function(e){return e.date});
    this.timeBarChartDatasets = [
    {
        data: this.statisticData.map(function(e){return e.totalVisitor}),
        label: this.commonService.getLocaleString("pageDashboard.success")
    },
    {
      data: this.statisticData.map(function(e){return e.totalException}),
      label: this.commonService.getLocaleString("pageDashboard.exception")
    }];
  }

}
