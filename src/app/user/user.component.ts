import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';

@Component({
  templateUrl: 'user.component.html'
})

export class UserComponent {
  @ViewChild("userForm") userForm : NgForm ;

  public data = [];
  public filterQuery = '';
  private srcUser = '';

  private isAdmin = false;

  model: {
    "title"?: string, "action": string, "username"?: string, "group"?: string, "password"?: string, "repeatpassword"?: string, "buttom"?: string
  } =
    {
      "title": "New User",
      "action": "New User",
      "username": "",
      "group": "user",
      "password": "",
      "repeatpassword": "",
      "buttom": "Create User"
    };

  constructor(private _userService: UserService) {
    var me = this;

    setTimeout(async () => {
      var currUser = await me._userService.getCurrentUser();
      if (currUser.username == "Admin")
        me.isAdmin = true;
      else
        me.isAdmin = false;
      console.log(me.isAdmin);

      let users = await this._userService.getUsersList();
      for (var user of users) {
        me.data.push(JSON.parse(`{"username" : "` + user["name"] + `", "group": "` + user["group"] + `"}`));
      }
    }, 1000);
  }

  newUser() {
    this.userForm.form.reset();
    
    var u = ("000" + this.data.length);
        u = "user" + u.substr( u.length - 3, 3);

    this.model.title = "New User";
    this.model.action = "New User";
    this.model.username = u;
    this.model.group = "user";
    this.model.password = "";
    this.model.repeatpassword = "";
    this.model.buttom = "Create User";

    
  }

  async deleteUser(item) {
    this.model.username = item.username;
    console.log("deleteUser");
    console.log(JSON.stringify(this.model));
    var result = await this._userService.deleteUser(JSON.stringify(this.model));

    var index = this.data.indexOf(item, 0);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    this.saveUser();
  }

  async saveUser() {
    if (this.model.action == "New User") {
      // Create User
      console.log("saveUser");
      console.log(JSON.stringify(this.model));
      var result = await this._userService.createUser(JSON.stringify(this.model));
      if (result != null)
        this.data.push(result);
    }

  }

}
