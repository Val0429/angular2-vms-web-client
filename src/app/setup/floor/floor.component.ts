import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { CreateEditFloorComponent } from './create-edit-floor.component';
import { AlertComponent } from 'app/dialog/alert/alert.component';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Floor } from '../../Interface/interface';
import { BatchUploadFloorComponent } from './batch-upload-floor.component';
import { BaseComponent, BaseClassComponent } from '../../shared/base-class-component';
import { TranslateService } from 'ng2-translate';
import { FloorService } from '../../service/floor.service';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent extends BaseClassComponent implements OnInit, BaseComponent {


  constructor(private userService: UserService, private floorService:FloorService,dialogService: DialogService, translateService: TranslateService) {
    super(dialogService, translateService);
  }
  tempData :Floor[] = [];
  data :Floor[]= [];
  filterQuery = "";
  actionMode = "";
  private isAdmin = false;


  async ngOnInit(): Promise<void> {

    let floors = await this.floorService.read("&paging.all=true");
    for (let floor of floors) {
      this.data.push(floor);
      this.tempData.push(floor);
    }
    this.isAdmin = this.userService.isAdmin();
    
    console.log("is admin:", this.isAdmin);
  }


  edit(item) {
    console.log("edit floor", item);
    this.actionMode = this.getLocaleString("common.edit");    
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
          this.save(data);
        }
      });
  }
  private showBatchUploadDialog() {
    //creates dialog form here
    let newForm = new BatchUploadFloorComponent(this.dialogService);
    newForm.setData(this.getLocaleString("pageFloor.batchUploadFloor"));
    let disposable = this.dialogService.addDialog(BatchUploadFloorComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          this.submitCSVFile({ data: newForm.getData()});          
        }
      });
  }
  async submitCSVFile(data: any) {
    var result = await this.floorService.batchUploadFloor(data);
    if (result) {
      //console.log(result);
      this.showAlert(result.paging.count + this.getLocaleString("pageFloor.haveBeenImported"));
      //refresh list
      await this.ngOnInit();
    }
  }
  batchUploadFloor() {
    this.showBatchUploadDialog();
  }
  createNew() {
    this.actionMode = this.getLocaleString("common.new") ;

    var u = ("000" + this.tempData.length);
    u = "floor" + u.substr(u.length - 3, 3);

    let data = new Floor();    
    data.name = u;
    data.floor = 0;
    data.objectId = "";
    this.showCreateEditDialog(data, false);
  }
  async delete(item: Floor) {
    console.log("delete floor", item);

    this.dialogService.addDialog(ConfirmComponent, {
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this.floorService.delete(item.objectId);
          if (result) {
            var index = this.data.indexOf(item, 0);
            this.data.splice(index, 1);

            var tempIndex = this.tempData.indexOf(item, 0);
            this.tempData.splice(tempIndex, 1);

          }
        }
      });
  }

  async save(formResult: Floor) {
    // Create Floor
    formResult.objectId==="" ?
      await this.create(formResult):
    // update
      await this.update(formResult);    
  }
  async create(formResult: Floor) {         
    console.log("create floor", formResult);
    var result = await this.floorService.create(formResult);
    if (result) {
      this.data.push(result);
      this.tempData.push(result);
      this.showAlert(formResult.name + this.getLocaleString("common.hasBeenCreated"));
    }
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
      if (item.name.toLowerCase().indexOf(filter) > -1 ) {
        this.data.push(item);
      }
    }
  }

  async update(data: Floor) {
    
    
    console.log("update floor", data);

    var result = await this.floorService.update(data);
    
    if (result) {
      var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
      this.data[index] = result;
      var tempIndex = this.tempData.map(function (e) { return e.objectId }).indexOf(data.objectId);
      this.tempData[tempIndex] = result;
      this.showAlert(data.name + this.getLocaleString("common.hasBeenUpdated"));
    }



  }


}
