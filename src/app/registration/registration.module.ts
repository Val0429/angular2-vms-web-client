import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from 'ng2-translate';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Datepicker
import { DatepickerModule } from 'ng2-bootstrap/datepicker';

// Routing
import { RegistrationRoutingModule } from './registration-routing.module';

// Child Page Component 
import { PotraitComponent } from './potrait.component';
import { SuccessComponent } from './success.component';

@NgModule({
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    DatepickerModule.forRoot()
  ],
  declarations: [
    PotraitComponent,
    SuccessComponent
  ]
})
export class RegistrationModule { }
