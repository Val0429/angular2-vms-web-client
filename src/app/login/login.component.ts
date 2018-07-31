import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { Router } from '@angular/router';

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
  public rememberUsers: User[] = [];

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
    function OrderByArray(values: User[]) {
      return values.sort((a, b) => {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
        return 0
      });
    }

    var _remembers = JSON.parse(localStorage.getItem('rememberMe'));

    if (_remembers != null) {
      var u = [];

      for (var info of _remembers) {
        var newUser = new User().fromJSON(info);
        u.push(newUser);

        this.rememberUsers = OrderByArray(u);
      };
    }
  }

  ngOnInit() {
    this.model.username = "";
    this.model.password = "";
    this.model.rememberMe = false;
  }

  public loadRememberUser(user) {
    this.model.username = user.username;
    this.model.password = user.password;
  }
  public checkRememberMe(event) {
    this.model.rememberMe = event;
  }

  private removeRememberMe() {
    for (var info of this.rememberUsers) {
      if (info.username == this.model.username)
        var index = this.rememberUsers.indexOf(info, 0);
      if (index > -1) {
        this.rememberUsers.splice(index, 1);
      }

      localStorage.setItem('rememberMe', JSON.stringify(this.rememberUsers));
    }
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

    if (ret == true) {
      if (this.model.rememberMe) {
        this.removeRememberMe();

        var newUser = new User();
        newUser.username = this.model.username;
        newUser.password = this.model.password;

        this.rememberUsers.push(newUser);

        localStorage.setItem('rememberMe', JSON.stringify(this.rememberUsers));
      }

      this._router.navigate(['/user/manage-user']);
    }
    else {
      alert('Login failed.');
      this.loading = false;
    }
  }
}
