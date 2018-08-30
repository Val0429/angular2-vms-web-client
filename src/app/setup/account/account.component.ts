import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { User,UserData, RoleEnum, Company } from 'app/Interface/interface';
import { CreateEditUserComponent } from './create-edit-user.component';
import { CommonService } from '../../service/common.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { FloorService } from '../../service/floor.service';
import { CompanyService } from '../../service/company.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent  implements OnInit {
   

  constructor(
    private userService: UserService, 
    private commonService:CommonService, 
    private floorService:FloorService, 
    private companyService:CompanyService, 
    private dialogService:DialogService,
    private progressService:NgProgress
  ) {
    
  }
  tempData:User[]=[];
  data:User[] = [];
  filterQuery = '';
  actionMode = "";
  currentUser:User;
  
  async ngOnInit(): Promise<void> {  
    try{
      this.progressService.start();      
      let users = await this.userService.read("&paging.all=true");    
      this.data = Object.assign([], users);
      this.tempData = Object.assign([], users);
      this.currentUser = this.userService.getCurrentUser();
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }    
  }
  
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  edit(item: User) {
    if(this.isLoading())return;
    console.log("edit item", item);
    this.actionMode = this.commonService.getLocaleString("common.edit");    
    
    this.showCreateEditDialog(item, true); 
  }
  private showCreateEditDialog(data: User, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditUserComponent(this.userService, this.floorService, this.commonService, this.companyService, this.dialogService);
    //sets form data
    newForm.setFormData(data, this.actionMode, editMode);
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
    this.actionMode = this.commonService.getLocaleString("common.new");
    
    var u = ("000" + this.tempData.length);
    u = "user" + u.substr(u.length - 3, 3);

    let newItem = new User();
    newItem.objectId = "";  
    newItem.username= u;
    newItem.roles = [];    
    newItem.password= "";    
    newItem.data = new UserData();
    newItem.data.floor=[]
    newItem.data.company = new Company();
    newItem.data.company.objectId="";

    this.showCreateEditDialog(newItem, false);
  }
  async delete(item : User) {
    if(this.isLoading())return;
    console.log("deleteUser", item);
    this.dialogService.addDialog(ConfirmComponent, {})
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (!isConfirmed) return;
        try{
          this.progressService.start();
          await this.userService.delete(item.objectId);          
        
          let index = this.data.indexOf(item, 0);                      
          this.data.splice(index, 1);
          
          let tempIndex = this.tempData.indexOf(item, 0);            
          this.tempData.splice(tempIndex, 1);
          this.commonService.showAlert(item.username+" "+this.commonService.getLocaleString("common.hasBeenDeleted"));
        }//no catch, global error handle handles it
        finally{      
          this.progressService.done();
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
      //TODO: improve this filter
      if (item.username.toLowerCase().indexOf(filter) > -1 ) {
        this.data.push(item);
      }
    }
  }

  async save(formResult: User) {
    try{
      this.progressService.start();    
      formResult.objectId === ""? await this.create(formResult): await this.update(formResult);
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }

  async create(data:User) {    
    console.log("create user", data);
    var result = await this.userService.create(data);
    if (result) {
      this.data.push(result);
      this.tempData.push(result);
      this.commonService.showAlert(data.username + this.commonService.getLocaleString("common.hasBeenCreated"));
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
        this.commonService.showAlert(data.username + this.commonService.getLocaleString("common.hasBeenUpdated"));
      }
    
  }


}
