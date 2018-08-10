import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Roles, RoleOption, User, BaseUser, BaseClass, UserData } from 'app/Interface/interface';
import { CreateEditUserComponent } from './create-edit-user.component';
import { AlertComponent } from 'app/dialog/alert/alert.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
   

  constructor(private userService: UserService, private dialogService: DialogService) {
  }

  data = [];
  availableRoles: string[];
  filterQuery = "";
  actionMode = "";
  private srcUser = "";
  private isAdmin = false;
  

  async ngOnInit(): Promise<void> {    
    this.availableRoles = [];
    let roles = await this.userService.getUserRole();
    if (roles) {
      this.availableRoles = roles;      
    }
    let users = await this.userService.getUsersList();
    for (let user of users) {
      this.data.push(user);
    }
    
    this.isAdmin = this.userService.isAdmin();
    console.log("is admin:", this.isAdmin);
  }
  

  editUser(item) {
    console.log("edit item", item);
    this.actionMode = "Edit User";    
    
    this.showCreateEditDialog(item, true); 
  }
  private showCreateEditDialog(data: User, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditUserComponent(this.dialogService);
    //sets form data
    newForm.setFormData(data, this.actionMode, this.availableRoles, editMode);
    let disposable = this.dialogService.addDialog(CreateEditUserComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          let formData = newForm.getFormData();
          this.saveUser(formData);
        }
      });
  }

  newUser() {
    this.actionMode = "New User";
    
    var u = ("000" + this.data.length);
    u = "user" + u.substr(u.length - 3, 3);

    let newUser = new User();
      
    newUser.username= u;
    newUser.roles = [];
    newUser.password= "";    
    newUser.data = new UserData();
    newUser.data.email = "";

    this.showCreateEditDialog(newUser, false);
  }
  showAlert(message: string, title?: string) {
    let disposable = this.dialogService.addDialog(AlertComponent, {
      title: title,
      message: message
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        
      }); 
  }
  async deleteUser(item) {
    console.log("deleteUser", item);
    
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: "Confirmation",
      message: "Are you sure?"
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this.userService.deleteUser(item.objectId);
          var index = this.data.indexOf(item, 0);
          console.log(index);
          console.log(result);
          if (result && index > -1) {
            this.data.splice(index, 1);
          }
        }
      });    
  }

  async saveUser(formResult: User) {
    if (this.actionMode==="New User") {
      // Create User
      await this.createUser(formResult);
    } else {       
      // edit User
      await this.updateUser(formResult);
    }
  }
  async createUser(data:User) {
    //let formResult = this.child.getFormData();
    
    console.log("create user", data);
    var result = await this.userService.createUser(data);
    if (result) {
      this.data.push(result);
      this.showAlert("New user has been created");
    }
  }

  
  async updateUser(data:User) {      
      console.log("form result", data);      

      //update data without update password by admin
    if (data.password === "") {
      //removes password from object submission
      delete (data.password);
    }

      console.log("updateUser", data);      
       
      var result = await this.userService.updateUser(data);
      var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
      if (result && index > -1) {        
        //TODO: POP update result
        this.data[index] = result;
        this.showAlert(data.username+ " has been updated");
      }
    
  }


}
