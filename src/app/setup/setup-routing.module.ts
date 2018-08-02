import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { NetworkComponent } from './network.component';
import { ServerComponent } from './server/server.component';
import { EmailComponent } from './email/email.component';
import { SmsComponent } from './sms/sms.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { FloorComponent } from './floor/floor.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: '', data: { title: 'Setup' },
    canActivate: [LoginService],
    children: [
      {
        path: 'account',
        canActivate: [LoginService],
        component: AccountComponent,
        data: {
          title: 'Account Management'
        }
      },
      {
        path: 'server',
        canActivate: [LoginService],
        component: ServerComponent,
        data: {
          title: 'FRS Settings'
        }
      },
      {
        path: 'email',
        canActivate: [LoginService],
        component: EmailComponent,
        data: {
          title: 'Email Settings'
        }
      },
      {
        path: 'sms',
        canActivate: [LoginService],
        component: SmsComponent,
        data: {
          title: 'SMS Settings'
        }
      },
      {
        path: 'kiosk',
        canActivate: [LoginService],
        component: KioskComponent,
        data: {
          title: 'Kiosk Management'
        }
      },
      {
        path: 'floor',
        canActivate: [LoginService],
        component: FloorComponent,
        data: {
          title: 'Floor Management'
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
export class SetupRoutingModule { }
