import { Component,  OnInit } from '@angular/core';


@Component({
  selector: 'app-visitor-statistic',
  templateUrl: './visitor-statistic.component.html'
})
export class VisitorStatisticComponent implements OnInit {

  visitorsOnSite = 0;
  dailyTotalVisitors = 0;

  constructor(
    
  ) { }

  ngOnInit() {
    // TODO: Live Queries with websocket later
    this.initVisitEventWatcher();

    this.refreshCountTodayVisitor();
  }

  initVisitEventWatcher() {
    
  }

  refreshCountTodayVisitor() {
    
  }
}
