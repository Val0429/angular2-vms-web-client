import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreService } from 'app/service/core.service';
import { CryptoService } from 'app/service/crypto.service';

import { LoginService } from 'app/service/login.service';

import { ReportService } from 'app/service/report.service';
import { SetupService } from 'app/service/setup.service';
import { UserService } from 'app/service/user.service';
import { ActionService } from 'app/service/action.service';
import { RecognitionService} from 'app/service/recognition.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  declarations: [],
  providers: [CoreService, CryptoService, LoginService, ReportService, SetupService, UserService, RecognitionService, ActionService ]
})
export class ServiceModule { }
