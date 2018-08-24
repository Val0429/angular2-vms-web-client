import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { User, UserData, Company, RoleEnum, Floor } from 'app/Interface/interface';
import { CreateEditCompanyComponent } from './create-edit-company.component';
import { BaseClassComponent, BaseComponent } from '../../shared/base-class-component';
import { TranslateService } from 'ng2-translate';
import { CompanyService } from '../../service/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent extends BaseClassComponent implements OnInit, BaseComponent {
   

  constructor(private companyService: CompanyService, private userService:UserService,dialogService: DialogService, translateService: TranslateService) {
    super(dialogService, translateService);
  }
  tempData:Company[] = [];
  data:Company[] = [];
  filterQuery = '';
  actionMode = "";
  private isAdmin = false;
  

  async ngOnInit(): Promise<void> { 
    
    let items = await this.companyService.read("&paging.all=true");
    for (let item of items) {
      this.data.push(item);
      this.tempData.push(item);
    }
    
    this.isAdmin = this.userService.userIs(RoleEnum.Administrator);
    console.log("is admin:", this.isAdmin);
  }
  

  edit(item : Company) {
    console.log("edit item", item);
    this.actionMode = this.getLocaleString("common.edit");;    
    
    this.showCreateEditDialog(item, true); 
  }
  private showCreateEditDialog(data: Company, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditCompanyComponent(this.dialogService);
    //sets form data
    newForm.setFormData(data, [],this.actionMode, editMode);
    this.dialogService.addDialog(CreateEditCompanyComponent, newForm)
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
    console.log("delete item", item);    
    this.dialogService.addDialog(ConfirmComponent, {})
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          var result = await this.companyService.delete(item.objectId);          
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
      if (item.name.toLowerCase().indexOf(filter) > -1 || 
        item.unitNumber.toLowerCase().indexOf(filter) > -1 || 
        item.contactPerson.toLowerCase().indexOf(filter) > -1) {
        this.data.push(item);
      }
    }
  }

  async save(formResult: Company) {
    formResult.objectId === "" ?
    // Create 
    await this.create(formResult):
    // Update 
    await this.update(formResult);
    
  }
  async create(data:Company) {
    
    console.log("create ", data);

    var result = await this.companyService.create(data);
    if (result) {
      this.data.push(result);
      this.tempData.push(result);
      this.showAlert(data.name + this.getLocaleString("common.hasBeenCreated"));
    }
  }

  
  async update(data:Company) { 
      console.log("update", data);             
      var result = await this.companyService.update(data);    
      if (result) {
        var index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
        this.data[index] = result;
        var tempIndex = this.tempData.map(function (e) { return e.objectId }).indexOf(data.objectId);
        this.tempData[tempIndex] = result;        
        this.showAlert(data.name + this.getLocaleString("common.hasBeenUpdated"));
      }
    
  }


}
