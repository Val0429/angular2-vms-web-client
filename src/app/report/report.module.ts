import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

import { ChartsModule } from 'ng2-charts/ng2-charts';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {DatepickerModule,BsDropdownModule} from 'ng2-bootstrap';


import { DashboardComponent } from './dashboard.component';
import { InvestigationComponent } from './investigation.component';

import { ReportRoutingModule } from './report-routing.module';
import { TranslateModule } from 'ng2-translate';
import { VisitorStatisticComponent } from './visitor-statistic.component';
import { VisitorComponent } from './visitor.component';

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
    BsDropdownModule.forRoot(),
    DatepickerModule.forRoot()
  ],
  entryComponents: [
    VisitorComponent
  ],
  declarations: [
    DashboardComponent, 
    InvestigationComponent, 
    VisitorStatisticComponent, VisitorComponent
  ]
})
export class ReportModule { }
