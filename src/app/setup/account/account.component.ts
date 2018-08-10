import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Roles, RoleOption } from '../../Interface/interface';
import { CreateEditUserComponent } from './create-edit-user.component';
import { AlertComponent } from '../../dialog/alert/alert.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
   

  constructor(private _userService: UserService, private _dialogService: DialogService) {
  }

  data = [];
  availableRoles: string[];
  filterQuery = "";
  actionMode = "";
  private srcUser = "";
  private isAdmin = false;
  

  async ngOnInit(): Promise<void> {    
    this.availableRoles = [];
    let roles = await this._userService.getUserRole();
    if (roles) {
      this.availableRoles = roles;      
    }
    let users = await this._userService.getUsersList();
    for (let user of users) {
      this.data.push(user);
    }
    var currUser = await this._userService.getCurrentUser();
    this.isAdmin = currUser.roles.map(function (e) { return e.name }).indexOf("Administrator") > -1;
    console.log("is admin:", this.isAdmin);
  }
  

  editUser(item) {
    console.log("edit item", item);
    this.actionMode = "Edit User";
    let data = {
      objectId: item.objectId,
      title: this.actionMode,
      username: item.username,
      roles: item.roles.map(function (e) { return e.name; }),
      data:item.data,
      password: "",
      confirmPassword: "",
    }    
    
    this.showCreateEditDialog(data, true); 
  }
  private showCreateEditDialog(data: any, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditUserComponent(this._dialogService);
    newForm.setFormData(data, this.availableRoles, editMode);
    let disposable = this._dialogService.addDialog(CreateEditUserComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          let data = newForm.getFormData();
          this.saveUser(data);
        }
      });
  }

  newUser() {
    this.actionMode = "New User";
    
    var u = ("000" + this.data.length);
    u = "user" + u.substr(u.length - 3, 3);

    let data = {      
      title: this.actionMode,
      username: u,
      roles: [],
      password: "",
      confirmPassword: "",
      data: {email:""}
    }

    this.showCreateEditDialog(data, false);
  }
  showAlert(message: string, title?: string) {
    let disposable = this._dialogService.addDialog(AlertComponent, {
      title: title,
      message: message
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        
      }); 
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

  async saveUser(formResult:any) {
    if (this.actionMode==="New User") {
      // Create User
      await this.createUser(formResult);
    } else {       
      // edit User
      await this.updateUser(formResult);
    }
  }
  async createUser(formResult:any) {
    //let formResult = this.child.getFormData();
    console.log("form result", formResult);
    let data: any = {
      username: formResult.username,
      password: formResult.passwordGroup.password,
      data: formResult.data,
      roles: formResult.roles
    };
    console.log("create user", data);
    var result = await this._userService.createUser(data);
    if (result) {
      this.data.push(result);
      this.showAlert("New user has been created");
    }
  }

  
  async updateUser(formResult:any) {      
      console.log("form result", formResult);
      let data: any = {
        objectId: formResult.objectId,
        username: formResult.username,
        password: formResult.passwordGroup.password,
        data: formResult.data,
        roles: formResult.roles
      };

      //update data without update password by admin
    if (data.password === "") {
      //removes password from object submission
      delete (data.password);
    }

      console.log("updateUser", data);      
       
      var result = await this._userService.updateUser(data);
      var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
      if (result && index > -1) {        
        //TODO: POP update result
        this.data[index] = result;
        this.showAlert(data.username+ " has been updated");
      }
    
  }


}
