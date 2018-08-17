import { Component, ViewChild } from '@angular/core';
import { ReportService } from 'app/service/report.service';
import { BaseChartDirective } from 'ng2-charts/charts/charts';
//import * as Chart from 'chart.js';

@Component({
  templateUrl: 'dashboard.component.html',
  // styles: [`
  // .inputKey {
  //   width: 100px;
  //   margin-left:5px;
  //   margin-right:5px;
  // }
  // .form-control-file {
  //   -ms-flex: 1 1 auto;
  // }
  // `]
})
export class DashboardComponent {
  @ViewChild('timeBarChart') public timeBarChart: BaseChartDirective;
  @ViewChild('entryBarChart') public entryBarChart: BaseChartDirective;
  @ViewChild('groupPieChart') public groupPieChart: BaseChartDirective;



  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartTypeV: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartTypeH: string = 'horizontalBar';

  // timeBarChart
  public timeBarChartLabels: string[] = [];
  public timeBarChartData: any[] = [{ data: [], label: 'Registered' }, { data: [], label: 'Unregistered' }];


  // entryBarChart
  public entryBarChartLabels: string[] = [];
  public entryBarChartData: any[] = [{ data: [], label: 'Registered' }, { data: [], label: 'Unregistered' }];

  // groupPieChart
  public groupPieChartLabels: string[] = [];
  public groupPieChartData: number[] = [1];
  public groupPieChartType: string = 'pie';

  constructor(private reportService: ReportService) {
    // var me = this;
    // setTimeout(async () => {

    //   // let _devices = await this._actionService.getPushDeviceList();
    //   // for (var device of _devices) {
    //   //   me.data.push( JSON.parse(`{"push_device_type" : "` + device["push_device_type"] + `", "push_device_id": "` + device["push_device_id"] + `", "push_device_name": "` + device["push_device_name"] + `", "push_device_token": "` + device["push_device_token"] + `"}`) ) ;
    //   // }
    // }, 1000);
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);

    //var activePoints = this.vbarChart.getElementAtEvent(event);

    if (e.active.length > 0) {
      var serial = e.active[0]._view.datasetLabel;
      var serialIdx = e.active[0]._datasetIndex;

      var label = e.active[0]._view.label;
      var labelIdx = e.active[0]._index;

      var data = e.active[0]._chart.config.data.datasets[serialIdx].data[labelIdx];

      const chart = e.active[0]._chart;
    }
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  //public data = [];
  public async changeDuration(duration: string) {
    var start = 0, end = 0, parts = 0;
    var today = new Date();

    switch (duration) {
      case "day":
        start = today.setHours(0, 0, 0, 0);
        end = start + 86399999;
        parts = 3600000;
        break;
      case "week":
        var wday = today.getDate() - today.getDay();
        var w1stDay = new Date(today.setDate(wday));

        start = w1stDay.setHours(0, 0, 0, 0);
        end = start + (86400000 * 7) - 1;
        parts = 86400000;
        break;
      case "month":
        var y = today.getFullYear(), m = today.getMonth();
        var m1stDay = new Date(y, m, 1);
        var m31ndDay = new Date(y, m + 1, 0);

        start = m1stDay.getTime();
        end = m31ndDay.getTime() + 86399999;
        parts = 86400000;
    }

    start = 1526227200000;
    end = 1526313599999;

    this.timeBarChartLabels = [];
    this.timeBarChartData = [{ data: [], label: 'Registered' }, { data: [], label: 'Unregistered' }];

    this.entryBarChartLabels = [];
    this.entryBarChartData = [{ data: [], label: 'Registered' }, { data: [], label: 'Unregistered' }];

    this.groupPieChartLabels = [];
    this.groupPieChartData = [];

    // timeBarChart
    var timeBarChartData = [];
    for (var i = 0; start + (i * parts) < end; i++) {
      var s = start + (i * parts);
      var e = s + parts;

      var vNumber = await this.reportService.getVerifyResultCount(s, e);
      var nNumber = await this.reportService.getNonverifyResultCount(s, e);

      timeBarChartData.push(JSON.parse(`{ "label": "` + this.TimecodeToTimeString(s) + `", "verify": "` + vNumber + `", "nonverify": "` + nNumber + `" }`));
    }

    for (var data of timeBarChartData) {
      if (this.timeBarChartLabels.indexOf(data["label"]) <= -1) {
        this.timeBarChartLabels.push(data["label"]);

        this.timeBarChartData[0].data.push(data["verify"]);
        this.timeBarChartData[1].data.push(data["nonverify"]);
      }
    }

    if (this.timeBarChart.chart) {
      this.timeBarChart.chart.data.labels = this.timeBarChartLabels;
      this.timeBarChart.chart.update();
    }

    // entryBarChart
    var rkey = [];
    var rData = [];
    var uData = [];

    let cc = await this.reportService.getFcsSttings();
    var Verify = await this.reportService.getVerifyResultList(start, end);
    var Nonverify = await this.reportService.geNonverifyResultList(start, end);

    for (var c of cc) {
      var sourceid = c["video_source_sourceid"];
      var location = c["video_source_location"];

      for (var r1 of Verify) {
        //if (r1["channel"] == sourceid) {
        if ("default_source_id" == sourceid) {
          r1["channel"] = location;

          var idx = rkey.indexOf(location) ;
          if ( rkey.indexOf(location) <= -1) {
              rkey.push(location);
              rData.push(1);
              uData.push(0);
          }
          else {
            rData[idx]++;
          }
        }
      }

      for (var r2 of Nonverify) {
        //if (r2["channel"] == sourceid) {
        if ("default_source_id" == sourceid) {          
          r2["channel"] = location;

          var idx = rkey.indexOf(location) ;
          if ( rkey.indexOf(location) <= -1) {
              rkey.push(location);
              rData.push(0);
              uData.push(1);
          }
          else {
            uData[idx]++;
          }
        }
      }
    }

    for (var i = 0; i < rkey.length ; i++) {
      this.entryBarChartLabels.push(rkey[i]);
      this.entryBarChartData[0].data.push(rData[i]);
      this.entryBarChartData[1].data.push(uData[i]);
    }

    if (this.entryBarChart.chart) {
      this.entryBarChart.chart.data.labels = this.entryBarChartLabels;
      this.entryBarChart.chart.update();
    }


    // groupPieChart
    var groupPieChartData = [];
    for (var v of Verify) {
      var gs = v["groups"];
      if (gs) {
        for (var g of gs) {
          var name = g["name"];
          var idx = this.groupPieChartLabels.indexOf(name);
          if (idx<= -1)
          {
            this.groupPieChartLabels.push(name);
            this.groupPieChartData.push(1);
          }
          else {
            this.groupPieChartData[idx]++ ;
          }
        }
      }
    }

    if (this.groupPieChart.chart) {
      this.groupPieChart.chart.data.labels = this.groupPieChartLabels;
      this.groupPieChart.chart.update();
    }
  }

  TimecodeToTimeString(timecode: number): string {
    if (timecode == null) return "";

    var dd = new Date(timecode);
    var _h = dd.getHours() < 10 ? "0" + dd.getHours() : dd.getHours();
    var _m = dd.getMinutes() < 10 ? "0" + dd.getMinutes() : dd.getMinutes();

    return _h + ':' + _m;
  }
}
