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
    path: 'registration',
    loadChildren: './registration/registration.module#RegistrationModule',
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
  imports: [RouterModule.forRoot(routes, { enableTracing: true, useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
