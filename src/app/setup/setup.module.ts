import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap';

//sub menu components
import { SetupRoutingModule } from './setup-routing.module';
import { EmailComponent } from './email/email.component';
import { SmsComponent } from './sms/sms.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { FloorComponent } from './floor/floor.component';
import { AccountComponent } from './account/account.component';
import { FrsComponent } from './frs/frs.component';

//dialog components
import { CreateEditUserComponent } from './account/create-edit-user.component';
import { CreateEditKioskComponent } from './kiosk/create-edit-kiosk.component';
import { CreateEditFloorComponent } from './floor/create-edit-floor.component';
import { BatchUploadFloorComponent } from './floor/batch-upload-floor.component';

//translate
import { TranslateModule } from 'ng2-translate';
import { CompanyComponent } from './company/company.component';
import { CreateEditCompanyComponent } from './company/create-edit-company.component';

@NgModule({
  imports: [
    SetupRoutingModule,
    TranslateModule,
    ModalModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,    
    DatepickerModule.forRoot()
  ],
  entryComponents: [
    CreateEditUserComponent,
    CreateEditKioskComponent,
    CreateEditFloorComponent,
    BatchUploadFloorComponent
  ],
  declarations: [
    EmailComponent,
    SmsComponent,
    KioskComponent,
    FloorComponent,
    AccountComponent,
    FrsComponent,
    CreateEditUserComponent,    
    CreateEditKioskComponent,
    CreateEditFloorComponent,
    BatchUploadFloorComponent,
    CompanyComponent,
    CreateEditCompanyComponent
  ]
})
export class SetupModule { }
