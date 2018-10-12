import { Component, OnInit } from '@angular/core';
import { Invitation, CreateEditDialog, Visitor, Purpose, NotifyVisitor, Notify } from 'app/Interface/interface';
import { InvitationService } from 'app/service/invitation.service';
import { NgProgress } from 'ngx-progressbar';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
@Component({
  selector: 'app-create-invitation',
  templateUrl: './create-invitation.component.html'
})
export class CreateInvitationComponent extends DialogComponent<CreateEditDialog, Invitation> implements CreateEditDialog, OnInit{
  
  title: string;
  myform:FormGroup;
  email:FormControl;
  name:FormControl;
  phone:FormControl;
  purpose:FormControl;
  sendByEmail:FormControl;
  start:FormControl;
  end:FormControl;
  purposes:Purpose[] = [];
  formData: Invitation;
  sendBySms: FormControl;

  constructor(
    public dialogService:DialogService,
    private invitationService:InvitationService,     
    private progressService:NgProgress
  ) {
    super(dialogService);
    this.formData = new Invitation();
    this.formData.visitor = new Visitor();
    this.formData.purpose = new Purpose();
    this.formData.notify = new Notify();
    this.formData.notify.visitor = new NotifyVisitor();
    
    this.createFormControls();
    this.createForm();
  }
  createForm(): any {
    this.myform = new FormGroup ({
      email:this.email,
      name:this.name,
      phone:this.phone,
      sendByEmail:this.sendByEmail,      
      sendBySms:this.sendBySms,      
      start:this.start,
      end:this.end,
      purpose:this.purpose
    });
  }
  createFormControls(): any {
    this.email=new FormControl('',[Validators.required, Validators.pattern(Globals.emailRegex)]);
    this.name=new FormControl('',[Validators.required, Validators.minLength(3)]);
    this.phone=new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern(Globals.singlePhoneRegex)]);
    this.sendByEmail=new FormControl(true);
    this.sendBySms=new FormControl(true);
    this.start=new FormControl('',[Validators.required]);
    this.end=new FormControl('',[Validators.required]);
    this.purpose = new FormControl('',[Validators.required]);
  }

  async ngOnInit() {
    this.purposes = await this.invitationService.getPurposesList();
    var selectDummy = new Purpose(); 
    selectDummy.name = "select";
    selectDummy.objectId="";
    this.purposes.unshift(selectDummy);
  }


  public async mobileNoSearch(event) {
    //if (event.keyCode != 13) return;
    //get existing visitor 
    if(!this.phone.valid)return;

    let visitor = await this.invitationService.getVisitorFromMobile(this.phone.value);
    if(visitor!=null){
      this.name.setValue(visitor.name);
      this.email.setValue(visitor.email);
    }
  }

  async save() {    
    try{      
      this.formData.visitor.name=this.name.value;
      this.formData.visitor.phone=this.phone.value;
      this.formData.visitor.email=this.email.value;
      this.formData.purpose = this.purpose.value;
      this.formData.notify.visitor.email = this.sendByEmail.value;
      this.formData.notify.visitor.phone = this.sendBySms.value;
      console.log("save invitation", this.formData);
      this.progressService.start();
      var result = await this.invitationService.createInvitation(this.formData, this.start.value, this.end.value);
      if (result) {
        this.result=result;
        this.close();
      }
    }finally{
      this.progressService.done();
    }
  }
}
