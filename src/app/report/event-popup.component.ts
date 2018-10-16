import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { CreateEditDialog, KioskEvent, EventInvestigation, InvestigationDisplay } from '../infrastructure/interface';
import { LoginService } from '../service/login.service';
import { ConfigService } from '../service/config.service';
import { InvitationService } from 'app/service/invitation.service';

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html'
})
export class EventPopupComponent extends DialogComponent<CreateEditDialog, KioskEvent> implements CreateEditDialog, OnInit {
  public title:string;
  imgUrl :string;
  data : InvestigationDisplay;
  cgiRoot: string;
  constructor(public dialogService: DialogService, private loginService:LoginService, private configService:ConfigService, private invitationService:InvitationService) {    
    super(dialogService);
    this.data = new InvestigationDisplay();    
    this.imgUrl="";
    this.cgiRoot = this.configService.getCgiRoot();
   }
   public setFormData(data: InvestigationDisplay) {
    console.log("setFormData", data);
    this.data = data;    
    let tempEvents = Object.assign([], this.data.events);
    let token = this.loginService.getCurrentUserToken();

    this.data.events = [];
    for(let event of tempEvents){
      
      // must remove localhost from image address
      if(this.data && this.data.visitor.image && event.image && token!=null && this.invitationService.checkValidEvent(event.action)){
        
        event.image = event.image.replace("localhost", this.configService.getLocation().hostname);
        this.data.visitor.image = this.data.visitor.image.replace ("localhost", this.configService.getLocation().hostname);
  
        this.imgUrl=this.cgiRoot+"thumbnail?url="+data.visitor.image+"&size=300&sessionId="+token.sessionId;

        this.data.events.push(event);
      }
      
    }
    
      
  }
  ngOnInit() {
  }
}
