import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Roles, RoleOption } from '../../Interface/interface';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @ViewChild("userForm") userForm: NgForm;
  constructor(private _userService: UserService, private _dialogService: DialogService) {
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
    "roles"?: RoleOption[],
    "password"?: string,
    "confirmPassword"?: string,
    "createUserButton"?: string,
    "updateUserButton"?: string,
    "updatePasswordButton"?: string
  } =
    {
      "objectId":"",
      "title": "New User",
      "action": "New User",
      "username": "",
      "roles": [],
      "password": "",
      "confirmPassword": "",
      "createUserButton": "Create User",
      "updateUserButton": "Update User",
      "updatePasswordButton": "Update Password"
    };

  async ngOnInit(): Promise<void> {
    let me = this;
    var currUser = await me._userService.getCurrentUser();
    me.isAdmin = currUser.roles.map(function (e) { return e.name }).indexOf("Administrator") > -1;
    console.log("is admin:", me.isAdmin);
    let roles = await me._userService.getUserRole();
    if (roles) {
      for (let role of roles) {
        var newRole = new RoleOption();
        newRole.name = role;
        newRole.checked = false;
        me.model.roles.push(newRole);
      }
    }
    let users = await me._userService.getUsersList();
    for (let user of users) {
      me.data.push(user);
    }
  }
  editUser(item) {
    console.log("edit item",item);
    this.editMode = true;
    //this.userForm.form.reset();
    this.model.objectId = item.objectId;
    this.model.title = "Edit User";
    this.model.action = "Edit User";
    this.model.username = item.username;
    for (let i = 0; i < this.model.roles.length; i++) {
      let role = this.model.roles[i];
      let findIndex = item.roles.map(function (e) { return e.name; }).indexOf(role.name);      
      this.model.roles[i].checked = findIndex > -1;    
    }
    
    this.model.password = "";    
    this.model.confirmPassword = "";
    
  }
  newUser() {
    this.userForm.form.reset();
    this.editMode = false;
    var u = ("000" + this.data.length);
    u = "user" + u.substr(u.length - 3, 3);
    
    this.model.title = "New User";
    this.model.action = "New User";
    this.model.username = u;
    for (let role of this.model.roles) {      
      role.checked = false;
    }
    this.model.password = "";
    this.model.confirmPassword = "";
  }
  
  async deleteUser(item) {
    console.log("deleteUser", item);
    
    let disposable = this._dialogService.addDialog(ConfirmComponent, {
      title: "Confirmation",
      message: "Are you sure?"
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this._userService.deleteUser(item.objectId);
          var index = this.data.indexOf(item, 0);
          console.log(index);
          console.log(result);
          if (result && index > -1) {
            this.data.splice(index, 1);
          }
        }
      });
    
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
      console.log("saveUser", this.model);
      
      let data: object = {
        username: this.model.username,
        password: this.model.password,
        data: {},
        roles: this.getRolesFromModel()
      };
      console.log("create user", data);

      var result = await this._userService.createUser(data);
      if (result != null)
        this.data.push(result);
    }
  }
  async updatePasswordUser() {
    if (this.model.action === "Edit User") {
      // Update password User
      console.log("updatePasswordUser");
      var data: object = {
        objectId: this.model.objectId,
        password: this.model.password
      };

      console.log(data);
      var result = await this._userService.updateUser(data);
      
      if (result) {
        //TODO: POP update result
        
      }
    }
  }
  getRolesFromModel() {
    var roles = [];
    for (let role of this.model.roles) {
      if (role.checked && role.checked === true) {
        roles.push(role.name);
      }
    }
    return roles;
  }
  async updateUser() {
    if (this.model.action === "Edit User") {
      console.log("updateUser model", this.model); 
      

      var data: object = {
        objectId: this.model.objectId,
        //add something to it
        data: {},
        roles: this.getRolesFromModel()
      };
      console.log("updateUser", data);
      
       
      var result = await this._userService.updateUser(data);
      var index = this.data.map(function (e) { return e.objectId }).indexOf(this.model.objectId);
      if (result && index > -1) {        
        //TODO: POP update result
        this.data[index] = result;
      }
    }
  }

  updatePassword() {

  }

}
