import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { CreateEditDialog, RecurringVisitor, Visitor } from '../Interface/interface';
import * as Globals from 'app/globals';
import { LoginService } from '../service/login.service';
@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html'
})
export class VisitorComponent extends DialogComponent<CreateEditDialog, RecurringVisitor> implements CreateEditDialog, OnInit {
  public title:string;
  imgUrl :string;
  data : RecurringVisitor;
  constructor(public dialogService: DialogService, private loginService:LoginService) {    
    super(dialogService);
    this.data = new RecurringVisitor();
    this.data.visitor = new Visitor();
    this.imgUrl="";
   }
   public setFormData(data: RecurringVisitor, title: string) {
    console.log("setFormData");
    this.data = Object.assign({}, data);    
    this.title = title;    
    let token = this.loginService.getCurrentUserToken();
    
    if(this.data && this.data.visitor && token!=null){
      this.imgUrl=Globals.cgiRoot+"thumbnail?url="+data.visitor.image+"&size=300&sessionId="+token.sessionId;
    }
      
  }
  ngOnInit() {
  }
}
