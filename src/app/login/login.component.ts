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
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
export class LoginComponent extends BaseClassComponent implements BaseComponent  {
  myform: FormGroup;
  username: FormControl;
  password: FormControl;
  rememberMe: FormControl;
  language: FormControl;
  
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

    this.createForm();
  }
  
  createForm() {
    this.username = new FormControl('', [
      Validators.required,
      Validators.maxLength(64)
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.maxLength(64)
    ]);
    this.rememberMe = new FormControl('');
    this.language = new FormControl(this.activeLanguage);
    this.myform = new FormGroup({
      username: this.username,
      password: this.password,
      language: this.language,
      rememberMe: this.rememberMe
    });
  }

  onLanguageChange(lang) {
    localStorage.setItem(Globals.languageKey, lang);
    location.reload();
  }

  
  async doLogin(event) {
    if (event.keyCode !== 13 || !this.myform.valid) return;
    await this.loginByPassword();
  }

  async loginByPassword() {
    this.loading = true;
    let formResult = this.myform.value;
    
    let data = {
      username: formResult.username,
      password: formResult.password
    };
    console.log("login data", data);
    let ret = await this.loginService.logInByPassword(data);
    console.log("login result: "+ret);
    if (ret === true) {
      if (this.rememberMe) {
        var currentUserToken = sessionStorage.getItem(Globals.currentUserToken);
        localStorage.setItem(Globals.rememberMe, currentUserToken);        
      }
      //redirect to dashboard
      this.router.navigate(['/report/dashboard']);
    }
    else {
      this.showAlert(this.getLocaleString("pageLogin.invalidUserNameOrPassword"), this.getLocaleString("pageLogin.loginFailed"));
      this.loading = false;
    }
  }
}
