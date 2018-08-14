import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { CreateEditFloorComponent } from './create-edit-floor.component';
import { AlertComponent } from 'app/dialog/alert/alert.component';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Floor } from '../../Interface/interface';
import { BatchUploadFloorComponent } from './batch-upload-floor.component';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit {


  constructor(private userService: UserService, private dialogService: DialogService) {
  }

  data = [];
  filterQuery = "";
  actionMode = "";
  private srcUser = "";
  private isAdmin = false;


  async ngOnInit(): Promise<void> {

    let floors = await this.userService.getFloorList();
    for (let floor of floors) {
      this.data.push(floor);
    }
    this.isAdmin = this.userService.isAdmin();
    
    console.log("is admin:", this.isAdmin);
  }


  editFloor(item) {
    console.log("edit floor", item);
    this.actionMode = "Edit Floor";    
    this.showCreateEditDialog(item, true);
  }
  private showCreateEditDialog(floorData: Floor, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditFloorComponent(this.dialogService);
    newForm.setFormData(floorData, this.actionMode, editMode);
    let disposable = this.dialogService.addDialog(CreateEditFloorComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          let data = newForm.getFormData();
          this.saveFloor(data);
        }
      });
  }
  private showBatchUploadDialog() {
    //creates dialog form here
    let newForm = new BatchUploadFloorComponent(this.dialogService);
    newForm.setData("Batch Upload Floor" );
    let disposable = this.dialogService.addDialog(BatchUploadFloorComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          this.submitCSVFile({ data: newForm.getData()});          
        }
      });
  }
  async submitCSVFile(data: any) {
    var result = await this.userService.batchUploadFloor(data);
    if (result) {
      //console.log(result);
      this.showAlert("Import " + result.paging.count + " data succeded");
      //refresh list
      await this.ngOnInit();
    }
  }
  batchUploadFloor() {
    this.showBatchUploadDialog();
  }
  newFloor() {
    this.actionMode = "New Floor";

    var u = ("000" + this.data.length);
    u = "floor" + u.substr(u.length - 3, 3);

    let data = new Floor();
    data.name = u;
    data.phone = [];
    data.unitNo = "";
    data.floor = 0;
    data.objectId = "";
    this.showCreateEditDialog(data, false);
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
  async deleteFloor(item: Floor) {
    console.log("delete floor", item);

    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: "Confirmation",
      message: "Are you sure?"
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this.userService.deleteFloor(item.objectId);
          var index = this.data.indexOf(item, 0);
          console.log(index);
          console.log(result);
          if (result && index > -1) {
            this.data.splice(index, 1);
          }
        }
      });
  }

  async saveFloor(formResult: Floor) {
    // Create Floor
    if (!formResult.objectId || formResult.objectId==="") {      
      await this.createFloor(formResult);
    }
    else {// edit Floor      
      await this.updateFloor(formResult);
    }
  }
  async createFloor(formResult: Floor) {         
    console.log("create floor", formResult);
    var result = await this.userService.createFloor(formResult);
    if (result) {
      this.data.push(result);
      this.showAlert("New floor has been created");
    }
  }


  async updateFloor(data: Floor) {
    
    
    console.log("update floor", data);

    var result = await this.userService.updateFloor(data);
    var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
    if (result && index > -1) {
      //TODO: POP update result
      this.data[index] = result;
      this.showAlert(data.name + " has been updated");
    }

  }


}
