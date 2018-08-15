import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { TranslateModule } from 'ng2-translate';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';

import { FormsModule } from '@angular/forms';
//import { LaddaModule } from 'angular2-ladda';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    TranslateModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
  ]
})
export class LoginModule { }
