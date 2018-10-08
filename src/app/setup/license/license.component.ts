import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import { LicenseService } from '../../service/license.service';
import { NgProgress } from 'ngx-progressbar';
import { DialogService } from 'ng2-bootstrap-modal';
import { License, RoleEnum } from '../../Interface/interface';
import { CreateLicenseComponent } from './create-license.component';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  data: License[];
  tempData: License[];

  filterQuery = "";
  actionMode = "";
  isAdmin: boolean;

  constructor(
    private commonService:CommonService, 
    private licenseService:LicenseService,
    private progressService:NgProgress,
    private dialogService:DialogService,
    private userService:UserService
  ) { }

  async ngOnInit() {
    try{
      this.progressService.start();
      let items = await this.licenseService.read();      
      this.data= Object.assign([],items);
      console.log(this.data);
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
  itemSearch(event) {
    if (event.keyCode != 13) return;

    console.log("filter query: ", this.filterQuery);
    
    this.doSearch();
  }
  doSearch() {
    let filter = this.filterQuery.toLowerCase();
    this.data = [];
    for (let item of this.tempData) {
      if (item.licenseKey.toLowerCase().indexOf(filter) > -1) {
        this.data.push(item);
      }
    }
  }
  
  private showCreateDialog(online:boolean) {
    //creates dialog form here
    let newForm = new CreateLicenseComponent(this.licenseService, this.progressService, this.dialogService);
    
    newForm.title = online?this.commonService.getLocaleString("pageLicense.registerOnline"):this.commonService.getLocaleString("pageLicense.registerOffline");
    newForm.onlineMode = online;
    this.dialogService.addDialog(CreateLicenseComponent, newForm)
      .subscribe((result) => {
        //We get dialog result
        if (result) {          
          this.commonService.showAlert(this.commonService.getLocaleString("pageLicense.serialNumber") + this.commonService.getLocaleString("common.hasBeenRegistered")).subscribe(()=>{});
          
        }
      });
  }

  createNew(online:boolean) {
    this.showCreateDialog(online);
  }
  

}
