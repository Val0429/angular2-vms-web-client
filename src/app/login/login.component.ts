import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { Router } from '@angular/router';
import * as Defaults from "../defaults";
import { User } from 'app/Interface/interface';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
//import * as $ from 'jquery'
// import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
// import { NgForm } from '@angular/forms';
// import {FormControlDirective } from '@angular/forms';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: 'login.component.html',
  encapsulation: ViewEncapsulation.None,
  //directives: FormControlDirective,
  styles: [`
        .table {
          display: table;
          width: 100%;
        }
        .table-cell {
          display: table-cell;
          vertical-align: middle;
        }
      `]
})
export class LoginComponent implements OnInit {  

  model: {
    username?: string,
    password?: string,
    rememberMe?: boolean
  } = {};

  private loading: Boolean = false;

  constructor(
    private _router: Router,
    private _loginService: LoginService
  ) {

    let activeSession = _loginService.checkActiveSession();
    if (activeSession) {    
      //navigate to dashboard
      this._router.navigate(['/report/dashboard']);
    } else {
      //clear storage and force logout after user closed tab / browser
      this._loginService.logOut(); 
    }
  }

  ngOnInit() {
    this.model.username = "";
    this.model.password = "";
    this.model.rememberMe = false;
  }
  
  public checkRememberMe(event) {
    this.model.rememberMe = event;
  }

  private removeRememberMe() {
    localStorage.clear();
  }
  public forget() {
    this.removeRememberMe();
    this.model.username = "";
    this.model.password = "";
  }

  async loginByPassword() {
    this.loading = true;

    if (this.model.username && this.model.username.length > 64) {
      this.model.username = this.model.username.substr(0, 64);
    }

    if (this.model.password && this.model.password.length > 64) {
      this.model.password = this.model.password.substr(0, 64);
    }
    console.log(this.model.username);
    console.log(this.model.password);

    let data: string = `{ "username":"` + this.model.username + `", "password":"` + this.model.password + `" }`;
    let ret = await this._loginService.logInByPassword(data);
    console.log("login result: "+ret);
    if (ret == true) {
      if (this.model.rememberMe) {
        var currentUserToken = sessionStorage.getItem(Defaults.currentUserToken);
        localStorage.setItem(Defaults.rememberMe, currentUserToken);        
      }
      //redirect to dashboard
      this._router.navigate(['/report/dashboard']);
    }
    else {
      alert('Login failed.');
      this.loading = false;
    }
  }
}
