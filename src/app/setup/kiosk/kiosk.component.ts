import { Component, OnInit } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { CreateEditKioskComponent } from './create-edit-kiosk.component';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { KioskUser, KioskData, Role, RoleEnum } from '../../Interface/interface';
import { KioskService } from '../../service/kiosk.service';
import { UserService } from '../../service/user.service';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-kiosk',
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.scss']
})
export class KioskComponent implements OnInit{


  constructor(private kioskService: KioskService, private userService: UserService, private commonService: CommonService, private dialogService:DialogService) {
    
  }
  tempData :KioskUser[] = [];
  data:KioskUser[]= [];   
  filterQuery = "";
  actionMode = "";
  private isAdmin = false;

  itemSearch(event) {
    if (event.keyCode != 13) return;

    console.log("filter query: ", this.filterQuery);
    
    this.doSearch();
  }
  doSearch() {
    let filter = this.filterQuery.toLowerCase();
    this.data = [];
    for (let item of this.tempData) {
      if (item.username.toLowerCase().indexOf(filter) > -1 || item.data.kioskId.toLowerCase().indexOf(filter) > -1 || item.data.kioskName.toLowerCase().indexOf(filter) > -1) {
        this.data.push(item);
      }
    }
  }

  async ngOnInit(): Promise<void> {
    
    let users = await this.kioskService.read("&paging.all=true");
    for (let user of users) {
      this.data.push(user);
      this.tempData.push(user);
    }
    this.isAdmin = this.userService.userIs(RoleEnum.Administrator);
    console.log("is admin:", this.isAdmin);
  }


  edit(item: KioskUser) {
    console.log("edit kiosk", item);
    this.actionMode = this.commonService.getLocaleString("common.edit") ;

    let newData = new KioskUser();    
    newData.objectId = item.objectId;
    newData.username = item.username,
    newData.data = item.data;
    newData.roles = item.roles;
    newData.password = "";    

    this.showCreateEditDialog(newData, true);
  }
  private showCreateEditDialog(data: KioskUser, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditKioskComponent(this.dialogService);
    newForm.setFormData(data, this.actionMode, editMode);
    this.dialogService.addDialog(CreateEditKioskComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          let data = newForm.getFormData();
          this.save(data);
        }
      });
  }

  createNew() {
    this.actionMode = this.commonService.getLocaleString("common.new") ;

    var u = ("000" + this.tempData.length);
    u = "kiosk" + u.substr(u.length - 3, 3);

    let newData = new KioskUser();
    newData.objectId = "";
    newData.username = u;
    newData.roles = [];
    let kioskRole = new Role();
    kioskRole.name = "Kiosk";
    newData.roles.push(kioskRole);
    newData.data = new KioskData();
    newData.data.kioskId = "";
    newData.data.kioskName = "";
    newData.password = "";

    this.showCreateEditDialog(newData, false);
  }
  
  async delete(item:KioskUser) {
    console.log("delete kiosk", item);

    let disposable = this.dialogService.addDialog(ConfirmComponent, {            
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this.kioskService.delete(item.objectId);         
          
          if (result) {
            var index = this.data.indexOf(item, 0);
            this.data.splice(index, 1);

            var tempIndex = this.tempData.indexOf(item, 0);
            this.tempData.splice(tempIndex, 1);
          }
        }
      });
  }

  async save(formResult: KioskUser) {
    formResult.objectId === ""?
      // Create User
      await this.create(formResult):   
      // edit User
      await this.update(formResult);
    
  }
  async create(data: KioskUser) {
    //let formResult = this.child.getFormData();
   
    console.log("create kiosk", data);
    var result = await this.kioskService.create(data);
    if (result) {
      this.data.push(result);
      this.tempData.push(result);
      this.commonService.showAlert(data.data.kioskName + this.commonService.getLocaleString("common.hasBeenCreated"));
    }
  }


  async update(data: KioskUser) {
   
    console.log("update kiosk", data);
    //update data without update password by admin
    if (data.password === "") {
      //removes password from object submission
      delete (data.password);
    }
    var result = await this.kioskService.update(data);
    
    if (result) {
      var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
      this.data[index] = result;
      var tempIndex = this.tempData.map(function (e) { return e.objectId }).indexOf(data.objectId);
      this.tempData[tempIndex] = result;

      this.commonService.showAlert(data.username + this.commonService.getLocaleString("common.hasBeenUpdated"));
    }

  }


}
