import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';


@Component({
  templateUrl: 'login.component.html',
  encapsulation: ViewEncapsulation.None,
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
    password?: string
    //, rememberMe?: boolean
  } = {};

  private loading:Boolean = false;

  constructor(
    private _loginService: LoginService
  ) {
    //Observable.of([1, 2, 3]).map(x => x.map(x => x +1)).do(console.log).subscribe();
  }

  ngOnInit() {
    this.model.username = "";
    this.model.password = "";
  }

  loginByPassword() {
    this.loading = true;
  
    if (this.model.username && this.model.username.length > 64) {
      this.model.username = this.model.username.substr(0, 64);
    }

    if (this.model.password && this.model.password.length > 64) {
      this.model.password = this.model.password.substr(0, 64);
    }
    console.log(this.model.username);
    console.log(this.model.password);
    //this._loginService.logInByPassword({ username: this.model.username, password: this.model.password });

    let data: string = `{ "username":"` + this.model.username + `", "password":"` + this.model.password + `" }`;
    this._loginService.logInByPassword(data);
  }
}
