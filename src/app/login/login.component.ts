import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { Router } from '@angular/router';
import { User } from 'app/Interface/interface';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { DialogService } from 'ng2-bootstrap-modal';
import { AlertComponent } from '../dialog/alert/alert.component';
import  * as Globals from 'app/globals';
import { TranslateService } from 'ng2-translate';
import { BaseClassComponent, BaseComponent } from 'app/shared/base-class-component';

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
export class LoginComponent extends BaseClassComponent implements OnInit, BaseComponent  {  

  model: {
    username?: string,
    password?: string,
    rememberMe?: boolean,
    language?:string
  } = {
    };

  private loading: Boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
     
     dialogService: DialogService,
     translateService:TranslateService
  ) {
    super(dialogService, translateService);

    let activeSession = loginService.checkActiveSession();
    if (activeSession) {    
      //navigate to dashboard
      this.router.navigate(['/report/dashboard']);
    } else {
      //clear storage and force logout after user closed tab / browser
      this.loginService.logOut(); 
    }
  }
  
  onLanguageChange(lang) {
    localStorage.setItem(Globals.languageKey, lang);
    location.reload();
  }

  
  ngOnInit() {
    this.model.username = "";
    this.model.password = "";
    this.model.rememberMe = false;

    this.model.language = this.activeLanguage;
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

    let data: object = {
      username: this.model.username,
      password: this.model.password
    };
    let ret = await this.loginService.logInByPassword(data);
    console.log("login result: "+ret);
    if (ret === true) {
      if (this.model.rememberMe) {
        var currentUserToken = sessionStorage.getItem(Globals.currentUserToken);
        localStorage.setItem(Globals.rememberMe, currentUserToken);        
      }
      //redirect to dashboard
      this.router.navigate(['/report/dashboard']);
    }
    else {
      this.showAlert('Please check your account and password!', this.getLocaleString("pageLogin.loginFailed"));
      this.loading = false;
    }
  }
}
