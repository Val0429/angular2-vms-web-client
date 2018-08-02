import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';
import { LoginService } from 'app/service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  encapsulation: ViewEncapsulation.None,

})

export class FullLayoutComponent implements OnInit {
  model: {
    "title"?: string, "action": string, "username"?: string, "password"?: string, "newpassword"?: string, "repeatpassword"?: string, "buttom"?: string
  } =
    {
      "title": "Change Password",
      "action": "Modify",
      "username": "",
      "password": "",
      "newpassword": "",
      "repeatpassword": "",
      "buttom": "Save"
    };


  constructor(private _userService: UserService, private _loginService: LoginService, private _router:Router) { }

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  async ngOnInit() {
    var user = await this._userService.getCurrentUser();

    this.model.username = user.username;
    //this.model.password = user.password ;
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
       return;
    }
console.log('form submit');

    this.saveChangePassword();
 }


  public changePassword() {
    this.model.title = "Modify Person";
    this.model.action = "Modify";
    this.model.newpassword = "";
    this.model.repeatpassword = "";
    this.model.buttom = "Save";
  }

  async saveChangePassword() {
    var ret = await this._userService.changePassword(JSON.stringify(this.model));

    this.ngOnInit();
  }

  public async logout() {
    var result = await this._loginService.logOut();
    if (result) {
      this._router.navigate(['/login']);
    }
  }
}

