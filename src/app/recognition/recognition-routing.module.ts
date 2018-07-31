import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { FaceComponent } from './face.component';


const routes: Routes = [
  { path: '', data: { title: 'Recognition' },
    canActivate: [LoginService],
    children: [
      {
        path: 'face',
        canActivate: [LoginService],
        component: FaceComponent,
        data: {
          title: 'Face Recognition'
        }
      },
      {
        path: '**',
        redirectTo: 'face'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecognitionRoutingModule { }
