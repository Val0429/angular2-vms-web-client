import { Component, OnInit } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { CommonService } from 'app/service/common.service';
import { NgProgress } from 'ngx-progressbar';
import { Tablet, RoleEnum } from 'app/infrastructure/interface';
import { TabletService } from 'app/service/tablet.service';
import { UserService } from 'app/service/user.service';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { CreateEditTabletComponent } from './create-edit-tablet.component';

@Component({
  selector: 'app-tablets',
  templateUrl: './tablets.component.html',
  styleUrls: ['./tablets.component.scss']
})
export class TabletsComponent implements OnInit {
  constructor(     
    private tabletService: TabletService, 
    private userService:UserService,
    private dialogService: DialogService, 
    private commonService: CommonService,
    private progressService:NgProgress) {
    
  }
  tempData :Tablet[]=[];
  data :Tablet[]=[];
  filterQuery = "";
  actionMode = "";
  private isAdmin = false;


  async ngOnInit(): Promise<void> {
    try{      
      this.progressService.start();
      let items = await this.tabletService.read("&paging.all=true");
      this.data = Object.assign([],items);
      this.tempData= Object.assign([],items);      
      this.isAdmin = this.userService.userIs(RoleEnum.Administrator);      
      console.log("is admin:", this.isAdmin);
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }

  isLoading():boolean{
    return this.progressService.isStarted();
  }
  edit(item:Tablet) {
    if(this.isLoading())return;
    console.log("edit", item);
    this.actionMode = this.commonService.getLocaleString("common.edit");    
    this.showCreateEditDialog(item, true);
  }
  private showCreateEditDialog(itemData: Tablet, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditTabletComponent(this.tabletService, this.progressService, this.dialogService);
    newForm.setFormData(itemData, this.actionMode, editMode);
    this.dialogService.addDialog(CreateEditTabletComponent, newForm)
      .subscribe((result) => {
        //We get dialog result
        if (result) {          
          this.updateList(result);
        }
      });
  }
  createNew() {
    this.actionMode = this.commonService.getLocaleString("common.new") ;
    
    let data : Tablet = new Tablet();
    data.ip="";
    data.port=80;
    data.account="";
    data.password="";
    
    this.showCreateEditDialog(data, false);
  }
  async delete(item: Tablet) {
    if(this.isLoading())return;
    console.log("delete", item);

    this.dialogService.addDialog(ConfirmComponent, {
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (!isConfirmed) return;
        try{
          this.progressService.start();
          await this.tabletService.delete(item.objectId);                    
          //deletes data from array
          let index = this.data.indexOf(item, 0);                      
          this.data.splice(index, 1);          
          let tempIndex = this.tempData.indexOf(item, 0);            
          this.tempData.splice(tempIndex, 1);
          this.commonService.showAlert(item.ip + this.commonService.getLocaleString("common.hasBeenDeleted")).subscribe(()=>{});
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
      if (item.ip.toLowerCase().indexOf(filter) > -1 ) {
        this.data.push(item);
      }
    }
  }
  updateList(data:Tablet) {   
    let tempIndex = this.tempData.map(e => e.objectId).indexOf(data.objectId);
    if(tempIndex<0){
      this.tempData.push(data);
      this.data.push(data);
      this.commonService.showAlert(data.ip +this.commonService.getLocaleString("common.hasBeenCreated")).subscribe(()=>{});
    }
    else{
      //update data at specified index
      this.tempData[tempIndex] = data;    
      let index = this.data.map(e => e.objectId).indexOf(data.objectId);
      this.data[index] = data;
      this.commonService.showAlert(data.ip +this.commonService.getLocaleString("common.hasBeenUpdated")).subscribe(()=>{});
    }
  }

}
