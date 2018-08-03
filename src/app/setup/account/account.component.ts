import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  
  @ViewChild("userForm") userForm: NgForm;
  constructor(private _userService: UserService) {
  }
    
  

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

  async ngOnInit(): Promise<void> {
    let me = this;
    var currUser = await me._userService.getCurrentUser();
    if (currUser.username === "Admin")
      me.isAdmin = true;
    else
      me.isAdmin = false;
    console.log(me.isAdmin);

    let users = await this._userService.getUsersList();
    for (var user of users) {
      me.data.push(user);
    }
  }

  newUser() {
    this.userForm.form.reset();

    var u = ("000" + this.data.length);
    u = "user" + u.substr(u.length - 3, 3);

    this.model.title = "New User";
    this.model.action = "New User";
    this.model.username = u;
    this.model.group = "user";
    this.model.password = "";
    this.model.repeatpassword = "";
    this.model.buttom = "Create User";


  }

  async deleteUser(item) {
    console.log("deleteUser");
    console.log(item);
    var result = await this._userService.deleteUser(item.objectId);

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
      var result = await this._userService.createUser(JSON.stringify(this.model))
        .catch(error => {
          console.log(error);
        });
      if (result != null)
        this.data.push(result);
    }

  }

}
