import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { EmailComponent } from './email/email.component';
import { SmsComponent } from './sms/sms.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { FloorComponent } from './floor/floor.component';
import { AccountComponent } from './account/account.component';
import { FrsComponent } from './frs/frs.component';
import { CompanyComponent } from './company/company.component';
import { SmsSingaporeComponent } from './sms-singapore/sms-singapore.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'pageLayout.menu.setup'
    },
    canActivate: [LoginService],
    children: [
      {
        path: 'account',
        canActivate: [LoginService],
        component: AccountComponent,
        data: {
          title: 'pageLayout.setup.accountManagement'
        }
      },
      {
        path: 'company',
        canActivate: [LoginService],
        component: CompanyComponent,
        data: {
          title: 'pageLayout.setup.companyManagement'
        }
      },
      {
        path: 'frs',
        canActivate: [LoginService],
        component: FrsComponent,
        data: {
          title: 'pageLayout.setup.frsSetting'
        }
      },
      {
        path: 'email',
        canActivate: [LoginService],
        component: EmailComponent,
        data: {
          title: 'pageLayout.setup.emailSetting'
        }
      },
      {
        path: 'sms',
        canActivate: [LoginService],
        component: SmsComponent,
        data: {
          title: 'pageLayout.setup.smsSetting'
        }
      },
      {
        path: 'sms-singapore',
        canActivate: [LoginService],
        component: SmsSingaporeComponent,
        data: {
          title: 'pageLayout.setup.smsSettingSingapore'
        }
      },
      {
        path: 'kiosk',
        canActivate: [LoginService],
        component: KioskComponent,
        data: {
          title: 'pageLayout.setup.kioskManagement'
        }
      },
      {
        path: 'floor',
        canActivate: [LoginService],
        component: FloorComponent,
        data: {
          title: 'pageLayout.setup.floorManagement'
        }
      },
      {
        path: '**',
        redirectTo: 'account'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule {}
