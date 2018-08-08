import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Roles, RoleOption } from '../../Interface/interface';
import { CreateEditFormComponent } from './create-edit-form.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild(CreateEditFormComponent) child: CreateEditFormComponent;
  

  constructor(private _userService: UserService, private _dialogService: DialogService) {
  }  
  public data = [];
  public filterQuery = '';
  private srcUser = '';

  private isAdmin = false;
  

  model: {
    "objectId"?: string,
    "title"?: string,
    "action": string,
    "username"?: string,
    "roles"?: string[],
    "password"?: string,
    "confirmPassword"?: string
  } =
    {
      "objectId":"",
      "title": "New User",
      "action": "New User",
      "username": "",
      "roles": [],
      "password": "",
      "confirmPassword": ""
    };

  async ngOnInit(): Promise<void> {
    let me = this;
    
    let roles = await me._userService.getUserRole();
    if (roles) {
      this.child.setRoles(roles);
      me.model.roles = roles;
    }
    let users = await me._userService.getUsersList();
    for (let user of users) {
      me.data.push(user);
    }
    var currUser = await this._userService.getCurrentUser();
    this.isAdmin = currUser.roles.map(function (e) { return e.name }).indexOf("Administrator") > -1;
    console.log("is admin:", this.isAdmin);
  }
  

  editUser(item) {
    console.log("edit item", item);    
    
    this.model.objectId = item.objectId;
    this.model.title = "Edit User";
    this.model.action = "Edit User";
    this.model.username = item.username;
         
    this.model.roles = item.roles.map(function (e) { return e.name; });   
    
    this.model.password = "";    
    this.model.confirmPassword = "";

    this.child.setFormData(this.model, true);
  }
  newUser() {
    
    
    var u = ("000" + this.data.length);
    u = "user" + u.substr(u.length - 3, 3);
    
    this.model.title = "New User";
    this.model.action = "New User";
    this.model.username = u;
    this.model.roles = [];
    this.model.password = "";
    this.model.confirmPassword = "";

    this.child.setFormData(this.model, false);
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

  

  async saveUser() {
    if (this.model.action === "New User") {
      // Create User      
      await this.createUser();
    } else if (this.model.action === "Edit User") {
      // Create User      
      await this.updateUser();
    }
  }
  async createUser() {
    let formResult = this.child.getFormData();
    console.log("form result", formResult);
    let data: object = {
      username: formResult.username,
      password: formResult.passwordGroup.password,
      data: {},
      roles: formResult.roles
    };
    console.log("create user", data);
    var result = await this._userService.createUser(data);
    if (result != null)
      this.data.push(result);
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
  
  async updateUser() {
      let formResult = this.child.getFormData();
      console.log("form result", formResult);
      let data: object = {
        objectId: this.model.objectId,
        username: formResult.username,
        password: formResult.passwordGroup.password,
        data: {},
        roles: formResult.roles
      };      
      console.log("updateUser", data);      
       
      var result = await this._userService.updateUser(data);
      var index = this.data.map(function (e) { return e.objectId }).indexOf(this.model.objectId);
      if (result && index > -1) {        
        //TODO: POP update result
        this.data[index] = result;
      }
    
  }

  updatePassword() {

  }

}
