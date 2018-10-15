import { Component, OnInit, NgZone } from "@angular/core";
import { Investigation, KioskEvent, EventInvestigation } from "app/infrastructure/interface";
import { NgProgress } from "ngx-progressbar";
import { InvitationService } from "app/service/invitation.service";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DialogService } from "ng2-bootstrap-modal";
import { LoginService } from "app/service/login.service";
import { ConfigService } from "app/service/config.service";
import { EventPopupComponent } from "./event-popup.component";

@Component({
  templateUrl: 'investigation.component.html'
})
export class InvestigationComponent implements OnInit{
  ws: WebSocket;
  myform:FormGroup;
  enabled:FormControl;
  start:FormControl;
  end:FormControl;
  
  data : EventInvestigation[];
  thumbnailUrl:string;
  postThumbnailUrl:string;
  constructor(
    private zone:NgZone,
    private progressService:NgProgress, 
    private invitationService:InvitationService, 
    private dialogService:DialogService,
    private loginService:LoginService, 
    private configService:ConfigService
  ){
    this.createFormControls();
    this.createForm();
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  async ngOnInit() {
    let token = this.loginService.getCurrentUserToken();
    this.postThumbnailUrl="&size=300&sessionId="+token.sessionId;
    this.thumbnailUrl=this.configService.getCgiRoot()+"thumbnail?url=";
    //await this.doSearch();
    this.initVisitEventWatcher();
  }
  async doSearch(){
    try{
      this.progressService.start();      
      let items : Investigation[] = await this.invitationService.getInvestigations("&start="+this.start.value+"&end="+this.end.value);
      this.data = [];
      for(let item of items){     
        console.log("kiosk", item.kiosk);
        for(let event of item.events){
          
          if(this.data.map(function(e){return e.objectId}).indexOf(event.objectId)>-1)continue;

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
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    } 
  }
  createForm(): any {
    this.myform = new FormGroup({
      start : this.start,
      end:this.end,
      enabled:this.enabled
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
        console.log(result);
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
  }
}
