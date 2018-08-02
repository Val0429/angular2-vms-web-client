import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginService } from 'app/service/login.service';

import * as Globals from './globals';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    pathMatch: 'full'
  },
  {
    path: '', component: FullLayoutComponent,
    data: { title: 'Home' },
    canActivate: [LoginService],
    children: [
      {
        path: 'report',
        canActivate: [LoginService],
        loadChildren: './report/report.module#ReportModule'
      },
      {
        path: 'setup',
        canActivate: [LoginService],
        loadChildren: './setup/setup.module#SetupModule'
      },
      {
        path: 'user',
        canActivate: [LoginService],
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: 'recognition',
        canActivate: [LoginService],
        loadChildren: './recognition/recognition.module#RecognitionModule'
      },
      {
        path: 'action',
        canActivate: [LoginService],
        loadChildren: './action/action.module#ActionModule'
      },
      {
        path: 'stream',
        canActivate: [LoginService],
        loadChildren: './stream/stream.module#StreamModule'
      },
      {
        path: 'license',
        canActivate: [LoginService],
        loadChildren: './license/license.module#LicenseModule'
      },
      {
        path: 'tenant',
        canActivate: [LoginService],
        loadChildren: './tenant/tenant.module#TenantModule'
      },
      {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
