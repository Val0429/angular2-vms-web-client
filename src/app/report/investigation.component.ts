import { Component, OnInit, NgZone } from "@angular/core";
import { KioskEvent, EventInvestigation, KioskUser, Purpose, KioskData, InvestigationDisplay } from "app/infrastructure/interface";
import { NgProgress } from "ngx-progressbar";
import { InvitationService } from "app/service/invitation.service";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DialogService } from "ng2-bootstrap-modal";
import { LoginService } from "app/service/login.service";
import { ConfigService } from "app/service/config.service";
import { EventPopupComponent } from "./event-popup.component";
import { KioskService } from "app/service/kiosk.service";
import { CommonService } from "app/service/common.service";

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
  data : InvestigationDisplay[] =[];
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
  
  async doSearch(){
    try{
      this.progressService.start();   
      let filter="";
      if(this.kiosk.value) filter+="&kiosk="+this.kiosk.value;
      if(this.purpose.value) filter+="&purpose="+this.purpose.value;
      filter+="&paging.all=true";
      //gets investigation data
      let items = await this.invitationService.getInvestigations("&start="+this.start.value+"&end="+this.end.value+filter);
      this.data = []
      for(let item of items){
        //reformat data
        let newDisplayItem = Object.assign({}, item) as InvestigationDisplay;
        //get last item
        let lastEvent : KioskEvent;
        for(let eventIndex = item.events.length-1; eventIndex >= 0; eventIndex --){
          if(this.invitationService.checkValidEvent(item.events[eventIndex].action)){
            lastEvent = item.events[eventIndex];
            break;
          }
        }
        
        //display last event for current visitor
        if(lastEvent){
          newDisplayItem.action = lastEvent.action;
          newDisplayItem.createdAt = lastEvent.createdAt
          newDisplayItem.result = lastEvent.result;
          this.data.push(newDisplayItem);
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

  public eventClick(eventData: InvestigationDisplay): void {    
      let eventDialog = new EventPopupComponent(this.dialogService, this.loginService, this.configService, this.invitationService);      
      eventDialog.setFormData(eventData);
      eventDialog.title = this.commonService.getLocaleString("pageInvestigation."+eventData.action)
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
        console.log("enable live view:", this.enabled.value);

        
        if(!this.enabled.value ||  !result["objectId"] || !result["action"] || !result["owner"] || !this.invitationService.checkValidEvent(result["action"])) return;

        let ei = result as EventInvestigation;
        
        console.log("EventInvestigation", ei);

        let newEvent = new KioskEvent();
        newEvent.action = ei.action;
        newEvent.createdAt = ei.createdAt;
        newEvent.image = ei.image;
        newEvent.objectId = ei.objectId;
        newEvent.pin = ei.pin;
        newEvent.result = ei.result;
        newEvent.score = ei.score;
        newEvent.updatedAt = ei.updatedAt;
        
        //returns first occurence of this visitor 
        //try to find existing visitor
        let existingVisitor = this.data.map(function(e){return e.visitor.objectId}).indexOf(ei.visitor.objectId);
        let createNewData:boolean = true;
        if(existingVisitor > -1){
          console.log("this.data[existingVisitor]",this.data[existingVisitor]);
          let existingEvent = this.data[existingVisitor].events.map(function(e){return e.action}).indexOf(ei.action);
          //couldn't find existing event
          if(existingEvent < 0){
            //push to visitor events
            this.data[existingVisitor].events.push(newEvent);            
            //update latest result
            this.data[existingVisitor].action = ei.action;
            this.data[existingVisitor].result = ei.result;  
            this.data[existingVisitor].createdAt = ei.createdAt;
            createNewData=false;
          }
        }
        
        if(!createNewData)return;

        //create new data
        let newData = new InvestigationDisplay();
        newData.action = ei.action;
        newData.owner = Object.assign({}, ei.owner);
        newData.purpose = Object.assign({}, ei.invitation.purpose);
        newData.invitation = Object.assign({}, ei.invitation);
        newData.kiosk = Object.assign({}, ei.kiosk);
        newData.visitor = Object.assign({}, ei.visitor);
        newData.createdAt = ei.createdAt;
        newData.result = ei.result;                
        newData.events = [];

        newData.events.push(newEvent);
        
        this.data.unshift(newData);
        
      });
    }

    this.ws.onopen =  () => {
      console.log("live visitor investigation connection opened");
    };    
    
  }
  createFormControls(): any {
    let now : Date= new Date(Date.now());        
    let start = new Date(now.getFullYear(), now.getMonth(), 1);  

    let end = new Date(now.setDate(now.getDate()+1));
    this.start=new FormControl(start, [Validators.required]);
    this.end=new FormControl(end, [Validators.required]);

    this.enabled = new FormControl(true);
    this.kiosk = new FormControl('');
    this.purpose = new FormControl('');
  }
}
