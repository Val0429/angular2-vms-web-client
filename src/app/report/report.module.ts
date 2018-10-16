import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

import { ChartsModule } from 'ng2-charts/ng2-charts';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BsDropdownModule} from 'ng2-bootstrap';
import {DatepickerModule} from 'ng2-bootstrap/datepicker';

import { DashboardComponent } from './dashboard.component';
import { InvestigationComponent } from './investigation.component';

import { ReportRoutingModule } from './report-routing.module';
import { TranslateModule } from 'ng2-translate';
import { VisitorStatisticComponent } from './visitor-statistic.component';
import { VisitorPopupComponent } from './visitor-popup.component';
import { NgProgressModule } from 'ngx-progressbar';
import { EventPopupComponent } from './event-popup.component';

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
    DatepickerModule.forRoot(),
    NgProgressModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    VisitorPopupComponent,
    EventPopupComponent
  ],
  declarations: [
    DashboardComponent, 
    InvestigationComponent, 
    VisitorStatisticComponent, 
    VisitorPopupComponent, EventPopupComponent
  ]
})
export class ReportModule { }
