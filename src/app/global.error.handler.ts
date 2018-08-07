import { ErrorHandler, Injectable, Injector } from '@angular/core';
import {LoginService} from 'app/service/login.service';
import { Router } from '@angular/router';
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
    //log any error
    //TO DO: do better logging
    console.log("Error thrown from global error handler");
    console.log(error);
    //whenever we get 401 status, we force user to login again
    if (error.rejection.status && error.rejection.status === 401) {
      console.log("forced to login due to unauthorized token, message: ", error.rejection._body);
      const loginService = this.injector.get(LoginService);
      const routeService = this.injector.get(Router);
      loginService.invalidateSession();
      routeService.navigate(["/login"]);
        
    }
  }
  
}