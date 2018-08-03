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
  private editMode = false;

  model: {
    "objectId"?: string,
    "title"?: string,
    "action": string,
    "username"?: string,
    "group"?: string,
    "password"?: string,
    "repeatpassword"?: string,
    "createUserButton"?: string,
    "updateUserButton"?: string,
    "updatePasswordButton"?: string
  } =
    {
      "objectId":"",
      "title": "New User",
      "action": "New User",
      "username": "",
      "group": "user",
      "password": "",
      "repeatpassword": "",
      "createUserButton": "Create User",
      "updateUserButton": "Update User",
      "updatePasswordButton": "Update Password"
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
  editUser(item) {
    this.editMode = true;
    this.userForm.form.reset();
    this.model.objectId = item.objectId;
    this.model.title = "Edit User";
    this.model.action = "Edit User";
    this.model.username = item.username;
    this.model.group = "";
    this.model.password = "";
    this.model.repeatpassword = "";
    
  }
  newUser() {
    this.userForm.form.reset();
    this.editMode = false;
    var u = ("000" + this.data.length);
    u = "user" + u.substr(u.length - 3, 3);
    
    this.model.title = "New User";
    this.model.action = "New User";
    this.model.username = u;
    this.model.group = "user";
    this.model.password = "";
    this.model.repeatpassword = "";
  }

  async deleteUser(item) {
    console.log("deleteUser");
    console.log(item);
    var result = await this._userService.deleteUser(item.objectId).catch(error => {
      console.log(error);      
    });
    var index = this.data.indexOf(item, 0);
    if (result === 200 && index > -1) {
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
    if (this.model.action === "New User") {
      // Create User
      console.log("saveUser");
      console.log(this.model);
      var result = await this._userService.createUser(this.model)
        .catch(error => {
          console.log(error);
        });
      if (result != null)
        this.data.push(result);
    }
  }
  async updatePasswordUser() {
    if (this.model.action === "Edit User") {
      // Create User
      console.log("updatePasswordUser");
      var data: object = {
        objectId: this.model.objectId,
        password: this.model.password
      };

      console.log(data);
      var result = await this._userService.updateUser(data)
        .catch(error => {
          console.log(error);
        });
      
      if (result === 200) {
        //TODO: POP update result
        
      }
    }
  }

  async updateUser() {
    if (this.model.action === "Edit User") {
      // Create User
      console.log("updateUser");
      var data: object = {
        objectId: this.model.objectId,
        //add something to it
        data: {},
        //add roles array to modify user's role
        //roles:[""]
      };
      console.log(data);
      var result = await this._userService.updateUser(data)
        .catch(error => {
          console.log(error);
        });
      var index = this.data.map(function (e) { return e.objectId }).indexOf(this.model.objectId);
      if (result === 200 && index > -1) {
        //TODO: update other properties
        //TODO: POP update result
      }
    }
  }

  updatePassword() {

  }

}
