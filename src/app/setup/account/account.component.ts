import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Roles, RoleOption, User, BaseUser, BaseClass, UserData, RoleEnum } from 'app/Interface/interface';
import { CreateEditUserComponent } from './create-edit-user.component';
import { AlertComponent } from 'app/dialog/alert/alert.component';
import { FormControl } from '@angular/forms';
import { BaseClassComponent, BaseComponent } from '../../shared/base-class-component';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends BaseClassComponent implements OnInit, BaseComponent {
   

  constructor(private userService: UserService, dialogService: DialogService, translateService: TranslateService) {
    super(dialogService, translateService);
  }
  tempData=[]
  data = [];
  availableRoles: string[];
  filterQuery = '';
  actionMode = "";
  private isAdmin = false;
  

  async ngOnInit(): Promise<void> {    
    this.availableRoles = [];
    let roles = await this.userService.getUserRole();
    if (roles) {
      this.availableRoles = roles;      
    }
    let users = await this.userService.read("&paging.all=true");
    for (let user of users) {
      this.data.push(user);
      this.tempData.push(user);
    }
    
    this.isAdmin = this.userService.userIs(RoleEnum.Administrator);
    console.log("is admin:", this.isAdmin);
  }
  

  edit(item: User) {
    console.log("edit item", item);
    this.actionMode = this.getLocaleString("common.edit");;    
    
    this.showCreateEditDialog(item, true); 
  }
  private showCreateEditDialog(data: User, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditUserComponent(this.dialogService);
    //sets form data
    newForm.setFormData(data, this.actionMode, this.availableRoles, editMode);
    this.dialogService.addDialog(CreateEditUserComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          let formData = newForm.getFormData();
          this.save(formData);
        }
      });
  }

  createNew() {
    this.actionMode = this.getLocaleString("common.new");
    
    var u = ("000" + this.tempData.length);
    u = "user" + u.substr(u.length - 3, 3);

    let newUser = new User();
    newUser.objectId = "";  
    newUser.username= u;
    newUser.roles = [];
    newUser.password= "";    
    newUser.data = new UserData();
    newUser.data.email = "";

    this.showCreateEditDialog(newUser, false);
  }
  async delete(item : User) {
    console.log("deleteUser", item);
    this.dialogService.addDialog(ConfirmComponent, {})
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this.userService.delete(item.objectId);          
          if (result) {
            var index = this.data.indexOf(item, 0);                      
            this.data.splice(index, 1);
            
            var tempIndex = this.tempData.indexOf(item, 0);            
            this.tempData.splice(tempIndex, 1);
            
          }
        }
      });    
  }
  itemSearch(event) {
    if (event.keyCode != 13) return;

    console.log("filter query: ", this.filterQuery);
    
    this.doSearch();    
  }

  doSearch() {
    let filter = this.filterQuery.toLowerCase();
    this.data = [];
    for (let item of this.tempData) {
      if (item.username.toLowerCase().indexOf(filter) > -1 || (item.data.name && item.data.name.toLowerCase().indexOf(filter) > -1)) {
        this.data.push(item);
      }
    }
  }

  async save(formResult: User) {
    formResult.objectId === ""?
      // Create User
      await this.create(formResult):
     
      // edit User
      await this.update(formResult);
    
  }
  async create(data:User) {
    //let formResult = this.child.getFormData();
    
    console.log("create user", data);
    var result = await this.userService.create(data);
    if (result) {
      this.data.push(result);
      this.tempData.push(result);
      this.showAlert(data.username + this.getLocaleString("common.hasBeenCreated"));
    }
  }

  
  async update(data:User) {      
      console.log("form result", data);      

      //update data without update password by admin
    if (data.password === "") {
      //removes password from object submission
      delete (data.password);
    }

      console.log("updateUser", data);      
       
      var result = await this.userService.update(data);
    
    
      if (result) {        
        
        var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
        this.data[index] = result;
        var tempIndex = this.tempData.map(function (e) { return e.objectId }).indexOf(data.objectId);
        this.tempData[tempIndex] = result;        
        this.showAlert(data.username + this.getLocaleString("common.hasBeenUpdated"));
      }
    
  }


}
