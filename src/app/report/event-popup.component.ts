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
  tempEvents: any[] & KioskEvent[];
  constructor(public dialogService: DialogService, private loginService:LoginService, private configService:ConfigService, private invitationService:InvitationService) {    
    super(dialogService);
    this.data = new InvestigationDisplay();    
    this.imgUrl="";
    this.cgiRoot = this.configService.getCgiRoot();
   }
   public setFormData(data: InvestigationDisplay) {
    console.log("setFormData", data);
    this.data = data;    
    this.tempEvents = [];
    let token = this.loginService.getCurrentUserToken();

    for(let event of data.events){
      
      if(!this.invitationService.checkValidEvent(event.action)) continue;
      // must remove localhost from image address
      if(this.data && event.image && token!=null ){
        let visitorImage ="";
        event.image = event.image.replace("localhost", this.configService.getLocation().hostname);
        if(this.data.visitor.image){
          visitorImage = this.data.visitor.image.replace ("localhost", this.configService.getLocation().hostname);                    
        }else if(this.data.visitor.idcard && this.data.visitor.idcard.images && this.data.visitor.idcard.images.length>1)
        {
          visitorImage = this.data.visitor.idcard.images[0].replace ("localhost", this.configService.getLocation().hostname);                    
        }
        this.imgUrl=this.cgiRoot+"thumbnail?url="+visitorImage+"&size=300&sessionId="+token.sessionId;        
      }
      this.tempEvents.push(Object.assign({}, event));
    }
    console.log("this.tempEvents", this.tempEvents);
      
  }
  ngOnInit() {
  }
}
