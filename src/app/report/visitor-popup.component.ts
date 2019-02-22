import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { CreateEditDialog, RecurringVisitor, Visitor, Company } from '../infrastructure/interface';
import { LoginService } from '../service/login.service';
import { ConfigService } from '../service/config.service';
@Component({
  selector: 'app-visitor-popup',
  templateUrl: './visitor-popup.component.html'
})
export class VisitorPopupComponent extends DialogComponent<CreateEditDialog, RecurringVisitor> implements CreateEditDialog, OnInit {
  public title:string;
  imgUrl :string;
  data : RecurringVisitor;
  cgiRoot: string;
  constructor(public dialogService: DialogService, private loginService:LoginService, private configService:ConfigService) {    
    super(dialogService);
    this.data = new RecurringVisitor();
    this.data.visitor = new Visitor();
    this.data.visitor.company = new Company();
    this.imgUrl="";
    this.cgiRoot=this.configService.getCgiRoot();
   }
   public setFormData(data: RecurringVisitor, title: string) {
    console.log("setFormData", data);
    this.data = Object.assign({}, data);    
    this.title = title;    
    let token = this.loginService.getCurrentUserToken();
    
    if(this.data && this.data.visitor && token!=null){

      // must remove localhost from image address
      if(this.data.visitor.image){
        this.data.visitor.image = this.data.visitor.image.replace ("localhost", this.configService.getLocation().hostname);
        this.imgUrl=this.cgiRoot+"thumbnail?url="+data.visitor.image+"&size=300&sessionId="+token.sessionId;
        console.log("imgUrl1", this.imgUrl)
      }else if(this.data.visitor.idcard.images && this.data.visitor.idcard.images.length>0){
        let tmpUrlImg = this.data.visitor.idcard.images[0].replace ("localhost", this.configService.getLocation().hostname);
        this.imgUrl=this.cgiRoot+"thumbnail?url="+tmpUrlImg+"&size=300&sessionId="+token.sessionId;
        console.log("imgUrl2", this.imgUrl)
      }      
    }
      
  }
  ngOnInit() {
  }
}
