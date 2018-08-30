import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'app/service/login.service';
import  * as Globals from 'app/globals';
import { TranslateService } from 'ng2-translate';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../service/common.service';

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
export class LoginComponent  {
  myform: FormGroup;
  username: FormControl;
  password: FormControl;
  rememberMe: FormControl;
  language: FormControl;
  activeLanguage: string;
  loading: boolean;
  
  constructor(
    private router: Router,
    private loginService: LoginService,
     
     public commonService: CommonService,
     public translateService:TranslateService
  ) {
    //activate language service
    this.activeLanguage = localStorage.getItem(Globals.languageKey);
    var browserLanguage = window.navigator.language.toLowerCase();
    
    if (this.activeLanguage === null) {
      if (browserLanguage === "zh-tw" || browserLanguage === "en-us") {
        this.activeLanguage = browserLanguage;
      } else {
        this.activeLanguage = "en-us";
      }
    }    
    this.translateService.setDefaultLang(this.activeLanguage);
    this.loading = false;

    //prevents user to access this page if user alread login
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
      this.commonService.showAlert(this.commonService.getLocaleString("pageLogin.invalidUserNameOrPassword"), this.commonService.getLocaleString("pageLogin.loginFailed"));
      this.loading = false;
    }
  }
}
