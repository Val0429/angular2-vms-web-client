import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { InvestigationComponent } from './investigation.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    data: { title: 'pageLayout.menu.report' },
    canActivate: [LoginService],
    children: [
      {
        path: 'dashboard',
        canActivate: [LoginService],
        component: DashboardComponent,
        data: {
          title: 'pageLayout.report.dashboard'
        }
      },
      {
        path: 'investigation',
        canActivate: [LoginService],
        component: InvestigationComponent,
        data: {
          title: 'pageLayout.report.investigation'
        }
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
