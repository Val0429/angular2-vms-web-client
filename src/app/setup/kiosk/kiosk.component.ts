import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { CreateEditKioskComponent } from './create-edit-kiosk.component';
import { AlertComponent } from 'app/dialog/alert/alert.component';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { KioskUser, KioskData, Roles } from '../../Interface/interface';

@Component({
  selector: 'app-kiosk',
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.scss']
})
export class KioskComponent implements OnInit {


  constructor(private userService: UserService, private dialogService: DialogService) {
  }

  data = [];   
  filterQuery = "";
  actionMode = "";
  private srcUser = "";
  private isAdmin = false;


  async ngOnInit(): Promise<void> {
    
    let users = await this.userService.getKioskUsersList();
    for (let user of users) {
      this.data.push(user);
    }
    this.isAdmin = this.userService.isAdmin();
    console.log("is admin:", this.isAdmin);
  }


  editKiosk(item: KioskUser) {
    console.log("edit kiosk", item);
    this.actionMode = "Edit Kiosk";

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
    let disposable = this.dialogService.addDialog(CreateEditKioskComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          let data = newForm.getFormData();
          this.saveKiosk(data);
        }
      });
  }

  newKiosk() {
    this.actionMode = "New Kiosk";

    var u = ("000" + this.data.length);
    u = "kiosk" + u.substr(u.length - 3, 3);

    let newData = new KioskUser();
    newData.username = u;
    newData.roles = [];
    let kioskRole = new Roles();
    kioskRole.name = "Kiosk";
    newData.roles.push(kioskRole);
    newData.data = new KioskData();
    newData.data.kioskId = "";
    newData.data.kioskName = "";
    newData.password = "";

    this.showCreateEditDialog(newData, false);
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
  async deleteKiosk(item) {
    console.log("delete kiosk", item);

    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: "Confirmation",
      message: "Are you sure?"
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this.userService.deleteKiosk(item.objectId);
          var index = this.data.indexOf(item, 0);
          console.log(index);
          console.log(result);
          if (result && index > -1) {
            this.data.splice(index, 1);
          }
        }
      });
  }

  async saveKiosk(formResult: KioskUser) {
    if (this.actionMode === "New Kiosk") {
      // Create User
      await this.createKiosk(formResult);
    } else {
      // edit User
      await this.updateKiosk(formResult);
    }
  }
  async createKiosk(data: KioskUser) {
    //let formResult = this.child.getFormData();
   
    console.log("create kiosk", data);
    var result = await this.userService.createKiosk(data);
    if (result) {
      this.data.push(result);
      this.showAlert("New kiosk has been created");
    }
  }


  async updateKiosk(data: KioskUser) {
   
    console.log("update kiosk", data);
    //update data without update password by admin
    if (data.password === "") {
      //removes password from object submission
      delete (data.password);
    }
    var result = await this.userService.updateKiosk(data);
    var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
    if (result && index > -1) {
      //TODO: POP update result
      this.data[index] = result;
      this.showAlert(data.username + " has been updated");
    }

  }


}
