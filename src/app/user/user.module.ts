import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

// DataTable
import { DataTableModule } from 'angular2-datatable';

//Selection Dropdown
import { ModalModule } from 'ng2-bootstrap/modal';

// Ng2-select
import { SelectModule } from 'ng2-select';

// Child Page Component 
import { PersonComponent } from './person.component';
import { GroupComponent } from './group.component';
import { BatchEnrollComponent } from './batchenroll.component';

//Routing
import { UserRoutingModule } from './user-routing.module';

//From Directive
import { ConfirmPasswordValidator } from './confirmpassword-validation.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule,
    HttpModule,
    DataTableModule,
    ModalModule.forRoot(),
    SelectModule
  ],
  declarations: [
    GroupComponent,
    PersonComponent,
    BatchEnrollComponent,
    
    ConfirmPasswordValidator
  ]
})
export class UserModule { }
