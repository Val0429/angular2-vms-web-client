import { Component, OnInit, NgZone } from "@angular/core";
import { Investigation, KioskEvent, EventInvestigation, KioskUser, Purpose, KioskData } from "app/infrastructure/interface";
import { NgProgress } from "ngx-progressbar";
import { InvitationService } from "app/service/invitation.service";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DialogService } from "ng2-bootstrap-modal";
import { LoginService } from "app/service/login.service";
import { ConfigService } from "app/service/config.service";
import { EventPopupComponent } from "./event-popup.component";
import { KioskService } from "app/service/kiosk.service";
import { CommonService } from "app/service/common.service";
import { query } from "@angular/animations";

@Component({
  templateUrl: 'investigation.component.html'
})
export class InvestigationComponent implements OnInit{
  ws: WebSocket;
  
  myform:FormGroup;
  enabled:FormControl;
  start:FormControl;
  end:FormControl;
  kiosk:FormControl;
  purpose:FormControl;

  kioskData:KioskUser[];
  purposeData:Purpose[];
  data : EventInvestigation[] =[];
  thumbnailUrl:string;
  postThumbnailUrl:string;
  constructor(
    private zone:NgZone,
    private progressService:NgProgress, 
    private invitationService:InvitationService, 
    private dialogService:DialogService,
    private loginService:LoginService, 
    private configService:ConfigService,
    private commonService:CommonService,
    private kioskService:KioskService
  ){
    this.createFormControls();
    this.createForm();
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  async ngOnInit() {
    let token = this.loginService.getCurrentUserToken();
    this.postThumbnailUrl="&size=300&sessionId="+ (token && token.sessionId ? token.sessionId : "");
    this.thumbnailUrl=this.configService.getCgiRoot()+"thumbnail?url=";
    //await this.doSearch();
    this.initVisitEventWatcher();
    try{
      this.progressService.start();  
      let selectPurpose = new Purpose();
      selectPurpose.name = "select";
      selectPurpose.objectId="";
      this.purposeData = await this.invitationService.getPurposesList();
      this.purposeData.unshift(selectPurpose);
      this.kioskData = await this.kioskService.read("&paging.all=true");
      let selectKiosk = new KioskUser();
      selectKiosk.data = new KioskData();
      selectKiosk.data.kioskName = this.commonService.getLocaleString("common.select")+this.commonService.getLocaleString("pageKiosk.kioskName");
      selectKiosk.objectId="";
      this.kioskData.unshift(selectKiosk);
      }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    } 
  }
  checkValidEvent(action:string):boolean{
      return action == "EventStrictTryCheckIn" || 
        action == "EventStrictConfirmPhoneNumber" || 
        action == "EventStrictCompareFace" || 
        action == "EventStrictCompleteCheckIn";
  }
  async doSearch(){
    try{
      this.progressService.start();   
      let filter="";
      if(this.kiosk.value) filter+="&kiosk="+this.kiosk.value;
      if(this.purpose.value) filter+="&purpose="+this.purpose.value;
      //gets investigation data
      let items : Investigation[] = await this.invitationService.getInvestigations("&start="+this.start.value+"&end="+this.end.value+filter);
      this.data = [];
      //reformat to eventIvestigation structure
      for(let item of items){     
        //console.log("kiosk", item.kiosk);
        for(let event of item.events){
          
          if(!this.checkValidEvent(event.action) || this.data.map(function(e){return e.objectId}).indexOf(event.objectId)>-1)continue;

          let i = new EventInvestigation();
          i.kiosk = Object.assign({}, item.kiosk);
          i.visitor = Object.assign({}, item.visitor);
          i.purpose = Object.assign({}, item.purpose);
          i.objectId = event.objectId;
          i.action = event.action;
          i.createdAt = event.createdAt;
          i.score = event.score;
          i.image = event.image;
          i.pin = event.pin;        
          this.data.push(i);
        }
      }  

      //sort data descending according to createdAt
      this.data = this.data.sort((obj1, obj2) => {
        if (obj1.createdAt > obj2.createdAt) {
            return -1;
        }    
        if (obj1.createdAt < obj2.createdAt) {
            return 1;
        }    
        return 0;
      });
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    } 
  }
  createForm(): any {
    this.myform = new FormGroup({
      start : this.start,
      end:this.end,
      enabled:this.enabled,
      purpose:this.purpose,
      kiosk:this.kiosk
    });
  }

  public eventClick(eventData: EventInvestigation): void {    
      let eventDialog = new EventPopupComponent(this.dialogService, this.loginService, this.configService);
      eventDialog.setFormData(eventData);
      this.dialogService.addDialog(EventPopupComponent, eventDialog).subscribe(() => {});    
  }
  initVisitEventWatcher() :void{
   
    var token = this.loginService.getCurrentUserToken();
    if(token==null)return;
    this.ws = new WebSocket(this.configService.getWsRoot()+"visitors/monitor?sessionId="+token.sessionId);
    
    this.ws.onmessage = (ev:MessageEvent)=>{
      this.zone.run(() => {
        let result = JSON.parse(ev.data);
        console.log("ws receive data", result);
        if(result["objectId"]&&result["action"]&&this.checkValidEvent(result["action"])){
          let ei = result as EventInvestigation;
          ei.purpose = Object.assign({}, ei.invitation.purpose);
          console.log("enable live view:", this.enabled.value);
          if(this.enabled.value){
            this.data.unshift(ei);
          }
        }
      });
    }

    this.ws.onopen =  () => {
      console.log("live visitor investigation connection opened");
    };    
    
  }
  createFormControls(): any {
    let now : Date= new Date(Date.now());        
    let start = new Date(now.getFullYear(), now.getMonth(), 1);  

    this.start=new FormControl(start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate() ,[Validators.required]);
    this.end=new FormControl(now.getFullYear()+"-"+(now.getMonth()+1)+"-"+(now.getDate()+1),[Validators.required]);
    this.enabled = new FormControl(true);
    this.kiosk = new FormControl('');
    this.purpose = new FormControl('');
  }
}
