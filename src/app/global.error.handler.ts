import { ErrorHandler, Injectable, Injector } from '@angular/core';
import {LoginService} from 'app/service/login.service';
import { Router } from '@angular/router';
import { CommonService } from './service/common.service';
@Injectable()
  /**
   * global error handlers
   * it handles any kind of unhandled error or uncaught exception
   * everything will be logged, except for unauthorized token
   * https://medium.com/@amcdnl/global-error-handling-with-angular2-6b992bdfb59c
   * **/
export class GlobalErrorHandler implements ErrorHandler {
  
  constructor(private injector: Injector) {
    
  }

  handleError(error) {

    const commonService = this.injector.get(CommonService);
    //log any error
    //TO DO: do better logging
    console.log("Error thrown from global error handler");
    console.log(error);

    //error related to REST API responses
    if (error.rejection && error.rejection.status) {
      
      //whenever we get 401 status, we force user to login again
      if(error.rejection.status === 401) {
        console.log("forced to logout due to unauthorized token, message: ", error.rejection._body);
        const loginService = this.injector.get(LoginService);        
        loginService.invalidateSession();

        commonService.showAlert(commonService.getLocaleString("pageLogin.pleaseRelogin"), commonService.getLocaleString("pageLogin.invalidSession"));

        const routeService = this.injector.get(Router);
        routeService.navigate(["/login"]);
      }
      //whenever we get 400 pop alert
      else if (error.rejection.status === 400) {
        //shows alert
        commonService.showAlert(error.rejection._body, commonService.getLocaleString("common.error"));
      }
      else if (error.rejection.status === 500) {
        //shows alert
        commonService.showAlert(commonService.getLocaleString("common.contactAdministrator"), commonService.getLocaleString("common.error"));
      }
    } 
  }

  
}
