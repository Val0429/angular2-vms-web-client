import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { UserComponent } from './user.component';
import { PersonComponent } from './person.component';
import { GroupComponent } from './group.component';
import { BatchEnrollComponent } from './batchenroll.component';

// Global Variable
// import * as Globals from '../globals';

const routes: Routes = [
  { path: '', data: { title: 'User' },
    canActivate: [LoginService],
    children: [   
      {
        path: 'manage-user',
        canActivate: [LoginService],
        component: UserComponent,
        data: {
          title: 'User Account'
        }
      },
      {
        path: 'enroll-person',
        canActivate: [LoginService],
        component: PersonComponent,
        data: {
          title: 'Enroll Person'
        }
      },
      {
        path: 'batch-person',
        canActivate: [LoginService],
        component: BatchEnrollComponent,
        data: {
          title: 'Batch Enroll'
        }
      },
      {
        path: 'user-group',
        canActivate: [LoginService],
        component: GroupComponent,
        data: {
          title: 'Person Group'
        }
      },
      {
        path: '**',
        redirectTo: 'manage-user'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
