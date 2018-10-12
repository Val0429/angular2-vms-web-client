import { Component, OnInit } from "@angular/core";
import { Investigation } from "app/infrastructure/interface";
import { NgProgress } from "ngx-progressbar";
import { InvitationService } from "app/service/invitation.service";
import { CommonService } from "app/service/common.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  templateUrl: 'investigation.component.html'
})
export class InvestigationComponent implements OnInit{
  
  myform:FormGroup;
  
  start:FormControl;
  end:FormControl;
  
  data : Investigation[];
  
  constructor(
    private progressService:NgProgress, 
    private invitationService:InvitationService, 
    private commonService:CommonService
  ){
    this.createFormControls();
    this.createForm();
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  async ngOnInit() {
    await this.doSearch();
  }
  async doSearch(){
    try{
      this.progressService.start();      
      let items = await this.invitationService.getInvestigations("&start="+this.start.value+"&end="+this.end.value);
      this.data= Object.assign([],items);         
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    } 
  }
  createForm(): any {
    this.myform = new FormGroup({
      start : this.start,
      end:this.end
    });
  }
  createFormControls(): any {
    let now : Date= new Date(Date.now());        
    let start = new Date(now.getFullYear(), now.getMonth(), 1);  

    this.start=new FormControl(start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate() ,[Validators.required]);
    this.end=new FormControl(now.getFullYear()+"-"+(now.getMonth()+1)+"-"+(now.getDate()+1),[Validators.required]);
  }
}
