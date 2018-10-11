import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { Company, RoleEnum, Floor } from 'app/Interface/interface';
import { CreateEditCompanyComponent } from './create-edit-company.component';
import { CompanyService } from '../../service/company.service';
import { FloorService } from '../../service/floor.service';
import { CommonService } from '../../service/common.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit{
   

  constructor(private companyService: CompanyService, 
    private userService:UserService, 
    private floorService:FloorService,
    private dialogService: DialogService, 
    private commonService: CommonService,
    private progressService:NgProgress) {
  }
  tempData:Company[] = [];
  data:Company[] = [];
  filterQuery = '';
  actionMode = "";
  private isAdmin = false;
  

  async ngOnInit(): Promise<void> { 
    try{
      this.progressService.start();
      //gets all data
      let items = await this.companyService.read("&paging.all=true");
      
      this.data= Object.assign([],items);
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

  edit(item : Company) {
    if(this.isLoading())return;
    console.log("edit item", item);
    this.actionMode = this.commonService.getLocaleString("common.edit");;    
    
    this.showCreateEditDialog(item, true); 
  }
  private showCreateEditDialog(data: Company, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditCompanyComponent(this.floorService, this.commonService, this.companyService, this.progressService, this.dialogService);
    //sets form data
    newForm.setFormData(data, this.actionMode, editMode);
    this.dialogService.addDialog(CreateEditCompanyComponent, newForm)
      .subscribe((result) => {
        //We get dialog result
        if (result) {          
          this.updateList(result);
        }
      });
  }

  createNew() {
    this.actionMode = this.commonService.getLocaleString("common.new");
    
    var u = ("000" + this.tempData.length);
    u = "company" + u.substr(u.length - 3, 3);
    let newItem = new Company();
    newItem.objectId = "";  
    newItem.name= u;
    newItem.unitNumber= "";
    newItem.contactPerson= "";
    newItem.contactNumber=[];
    newItem.floor=[];
    this.showCreateEditDialog(newItem, false);
  }
  async delete(item: Company) {
    if(this.isLoading())return;
    console.log("delete item", item);    
    this.dialogService.addDialog(ConfirmComponent, {})
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (!isConfirmed) return;
        try{
          this.progressService.start();
          await this.companyService.delete(item.objectId);                    
          //deletes data from array
          let index = this.data.indexOf(item, 0);                      
          this.data.splice(index, 1);          
          let tempIndex = this.tempData.indexOf(item, 0);            
          this.tempData.splice(tempIndex, 1);
          this.commonService.showAlert(item.name+" "+this.commonService.getLocaleString("common.hasBeenDeleted"));
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
      if (item.name.toLowerCase().indexOf(filter) > -1 || 
        item.unitNumber.toLowerCase().indexOf(filter) > -1 || 
        item.contactPerson.toLowerCase().indexOf(filter) > -1) {
        this.data.push(item);
      }
    }
  }

  updateList(data:Company) {   
    let tempIndex = this.tempData.map(function (e) { return e.objectId }).indexOf(data.objectId);
    if(tempIndex<0){
      this.tempData.push(data);
      this.data.push(data);
      this.commonService.showAlert(data.name + " "+this.commonService.getLocaleString("common.hasBeenCreated")).subscribe(()=>{});
    }
    else{
      //update data at specified index
      this.tempData[tempIndex] = data;    
      let index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
      this.data[index] = data;
      this.commonService.showAlert(data.name + " "+this.commonService.getLocaleString("common.hasBeenUpdated")).subscribe(()=>{});
    }
  }

}
