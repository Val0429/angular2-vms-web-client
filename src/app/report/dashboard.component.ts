import { Component, ViewChild, OnInit, SimpleChanges, NgZone } from '@angular/core';
import { ReportService } from 'app/service/report.service';
import { BaseChartDirective } from 'ng2-charts/charts/charts';
import { CommonService } from '../service/common.service';
import { ReportStatistic, KioskUser, RecurringVisitor, Visitor, BaseClass } from '../infrastructure/interface';
import { KioskService } from '../service/kiosk.service';
import { FormControl } from '@angular/forms';
import { VisitorPopupComponent } from './visitor-popup.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { LoginService } from '../service/login.service';
import { ConfigService } from '../service/config.service';
//import * as Chart from 'chart.js';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  statisticData:ReportStatistic[];
  recurringData:RecurringVisitor[];
  kiosks:KioskUser[];
  selectedKiosks:KioskUser[];
  
  
  @ViewChild('statisticChart') public statisticChart: BaseChartDirective;
  @ViewChild('recurringChart') public recurringChart: BaseChartDirective;

  end : Date;  
  start : Date;

  public barChartOptions: any;
  public barChartTypeV: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartTypeH: string = 'horizontalBar';

  // timeBarChart
  public timeBarChartLabels: string[];
  public statisticChartData: any[];
  

  // entryBarChart
  public entryBarChartLabels: string[];  
  public recurringChartData: any[];
  currentDuration: string;
  

  constructor(
      private reportService: ReportService, 
      private commonService:CommonService, 
      private kioskService: KioskService,
      private dialogService: DialogService,
      private loginService:LoginService,
      private configService:ConfigService
    ) {
    this.recurringData = [];
    this.statisticData = [];  
    this.selectedKiosks= [];

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
    firstRecurring.visitor.name="visitor";
    firstRecurring.totalVisit=0;
    this.recurringData.push(firstRecurring);

    this.initStatisticGraphs();
  }


  async ngOnInit(){   
    this.kiosks=[];
    this.recurringData=[];
    this.selectedKiosks = await this.kioskService.read("&paging.all=true");    
    await this.changeDuration('month');
    this.recurringData = await this.reportService.getRecurringVisitors(this.start, this.end);
    //console.log(this.recurringData);
    if(this.recurringData.length){
      this.setRecurringBarChartData();
      //this.recurringChart.chart.update();      
    }
  }

add(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean){
    console.log("add item:", item);
    this.commonService.addItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);
    this.changeDuration(this.currentDuration);
  }

  remove(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean) {
    console.log("remove item:", item);
    this.commonService.removeItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);    
    this.changeDuration(this.currentDuration);
  }
  private async updateCharts() {
    let kioskIds=this.selectedKiosks.map(e => e.objectId);
    if(kioskIds.length<=0) return;
    
    //get success data
    let sucessResult = await this.reportService.getStatistic(this.start, this.end, kioskIds);
    //copy result
    this.statisticData = Object.assign([], sucessResult);
    //merge with failed data
    let failedResult = await this.reportService.getException(this.start, this.end, kioskIds);
    for (let stat of failedResult) {
      let existsIndex = this.statisticData.map(e => e.date).indexOf(stat.date);
      if (existsIndex > -1) {
        this.statisticData[existsIndex].totalException = stat.totalException;
      }
      else {
        stat.totalVisitor = 0;
        this.statisticData.push(stat);
      }
    }
    console.log("statisticData",this.statisticData);
    if(this.statisticData  ){
      this.setStatisticChartData();
    }
  }

  initStatisticGraphs(): void {
    this.barChartOptions = {
      scaleShowVerticalLines: false,  
      hover: {
        mode: "nearest",
        intersec: true,
      },
      interaction: {
        mode: "nearest",
      },    
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {if (value % 1 === 0) {return value;}}
          },
          gridLines: { color: "#8B98B2" }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {if (value % 1 === 0) {return value;}}
          },
          gridLines: { color: "#8B98B2" }
        }]
      }
    };
    
    
    this.setStatisticChartData();
    this.setRecurringBarChartData();
  }
  // events
  public chartClicked(e: any): void {
    if (e.active.length > 0){
      let datasetIndex = e.active[0]._datasetIndex;
      let visitorData = this.recurringData[datasetIndex];
      let visitorDialog = new VisitorPopupComponent(this.dialogService, this.loginService, this.configService);
      visitorDialog.setFormData(visitorData, visitorData.visitor.name);
      this.dialogService.addDialog(VisitorPopupComponent, visitorDialog).subscribe(() => {});
    }

  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public async changeDuration(duration: string) {
    this.currentDuration = duration;
    let now = new Date();    
    this.end = new Date(now.setDate(now.getDate()+1));
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
    this.recurringChartData = this.recurringData.map(e=>{ return { data : [e.totalVisit], label : e.visitor.name}});
    //add dummy data to ensuer graphic is working <- weirdest thing ever
    this.recurringChartData.push({data:[0],label:"visitor"});
    
    //console.log("recurringChartData", this.recurringChartData);
  }

  private setStatisticChartData() {    
    
    this.timeBarChartLabels = this.statisticData.map(e=>e.date);
    this.statisticChartData = [
    {
        data: this.statisticData.map(e=> e.totalVisitor),
        label: this.commonService.getLocaleString("pageDashboard.success")
    },
    {
      data: this.statisticData.map(e => e.totalException),
      label: this.commonService.getLocaleString("pageDashboard.exception")
    }];

    console.log("statisticChartData", this.statisticChartData);
  }

}
