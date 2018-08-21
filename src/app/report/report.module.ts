import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

import { ChartsModule } from 'ng2-charts/ng2-charts';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {DatepickerModule} from 'ng2-bootstrap';


import { DashboardComponent } from './dashboard.component';
import { AttendanceComponent } from './attendance.component';

import { ReportRoutingModule } from './report-routing.module';
import { TranslateModule } from 'ng2-translate';
import { VisitorStatisticComponent } from './visitor-statistic.component';

@NgModule({
  imports: [
    TranslateModule,
    ReportRoutingModule,
    ModalModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule,
    ChartsModule, 
    DatepickerModule.forRoot()
  ],
  declarations: [DashboardComponent, AttendanceComponent, VisitorStatisticComponent]
})
export class ReportModule { }
