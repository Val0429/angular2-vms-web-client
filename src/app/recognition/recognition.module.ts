import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

//import { ChartsModule } from 'ng2-charts/ng2-charts';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap';

import { FaceComponent } from './face.component';

import { RecognitionRoutingModule } from './recognition-routing.module';

@NgModule({
  imports: [
    RecognitionRoutingModule,
    ModalModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule,
//    ChartsModule,
    DatepickerModule.forRoot()
  ],
  declarations: [FaceComponent]
})
export class RecognitionModule { }
