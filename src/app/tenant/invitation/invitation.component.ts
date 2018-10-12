import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { InvitationService } from 'app/service/invitation.service';
import { Invitation } from 'app/Interface/interface';
import { NgProgress } from 'ngx-progressbar';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';
import { CreateInvitationComponent } from './create-invitation.component';
import { CommonService } from 'app/service/common.service';

@Component({
  templateUrl: 'invitation.component.html',
  styleUrls: ["./invitation.component.scss"]
})

export class InvitationComponent implements OnInit {
  

  public data:Invitation[] = [];
  public tempData:Invitation[] = [];


  public filterQuery = '';

  

  constructor(
    private invitationService: InvitationService, 
    private progressService:NgProgress,
    private dialogService:DialogService,
    private commonService:CommonService
  ) {

  }

  async ngOnInit() {
    try{
      this.progressService.start();
      
      let items = await this.invitationService.getInvitationList();
      this.data= Object.assign([],items);
      this.tempData= Object.assign([],items);      
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    } 
  }

  public searchKeyUp(event) {
    if (event.keyCode != 13) return;

    this.doSearch();
  }

  private doSearch() {
    let filter = this.filterQuery.toLowerCase();
    this.data = [];
    for (let item of this.tempData) {
      if (item.visitor.name.toLowerCase().indexOf(filter) > -1 || item.visitor.phone.toLowerCase().indexOf(filter) > -1 || item.visitor.email.toLowerCase().indexOf(filter) > -1) {
        this.data.push(item);
      }
    }
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }

  public async invitationsSearch(event) {
    

  }
 
  public createNew(){
    
    //creates dialog form here
    let newForm = new CreateInvitationComponent(this.dialogService, this.invitationService, this.progressService);
    newForm.title = this.commonService.getLocaleString("common.new");
    this.dialogService.addDialog(CreateInvitationComponent, newForm)
      .subscribe((result) => {
        //We get dialog result
        if (result) {          
          this.updateList(result);
        }
      });
  }
  updateList(data:Invitation) {   
    let invitationTo = this.commonService.getLocaleString("pageInvitation.invitation")+ this.commonService.getLocaleString("common.to");
    let tempIndex = this.tempData.map(function (e) { return e.objectId }).indexOf(data.objectId);
    if(tempIndex<0){
      this.tempData.push(data);
      this.data.push(data);
      this.commonService.showAlert(invitationTo+data.visitor.name + this.commonService.getLocaleString("common.hasBeenCreated")).subscribe(()=>{});
    }
    else{
      //update data at specified index
      this.tempData[tempIndex] = data;    
      let index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
      this.data[index] = data;
      this.commonService.showAlert(invitationTo+data.visitor.name + this.commonService.getLocaleString("common.hasBeenUpdated")).subscribe(()=>{});
    }
  }

  async deleteInvitation(item : Invitation) {
    if (item == null) return;
    console.log("delete", item);

    this.dialogService.addDialog(ConfirmComponent, {
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (!isConfirmed) return;
        try{
          this.progressService.start();
          var result = await this.invitationService.cancelInvitation(item.objectId);
          this.updateList(result);
        }finally{
          this.progressService.done();
        }
    });
  }


  
}
