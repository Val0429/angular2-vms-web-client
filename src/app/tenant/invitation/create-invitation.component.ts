import { Component, OnInit } from '@angular/core';
import { VisitorProfile, CreateEditDialog } from 'app/Interface/interface';
import { InvitationService } from 'app/service/invitation.service';
import { CommonService } from 'app/service/common.service';
import { NgProgress } from 'ngx-progressbar';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
@Component({
  selector: 'app-create-invitation',
  templateUrl: './create-invitation.component.html'
})
export class CreateInvitationComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog{
  
  title: string;
  myform:FormGroup;
  email:FormControl;
  name:FormControl;
  phone:FormControl;

  model: {
    "sendBy": string[],
    "visitor": VisitorProfile
  } =
  {
    "sendBy": [],
    "visitor": new VisitorProfile()
  };

  constructor(
    public dialogService:DialogService,
    private invitationService:InvitationService, 
    private commonService:CommonService, 
    private progressService:NgProgress
  ) {
    super(dialogService);;
  
    this.createFormControls();
    this.createForm();
  }
  createForm(): any {
    this.myform = new FormGroup ({
      email:this.email,
      name:this.name,
      phone:this.phone
    });
  }
  createFormControls(): any {
    this.email=new FormControl('',[Validators.required, Validators.pattern(Globals.emailRegex)]);
    this.name=new FormControl('',[Validators.required, Validators.minLength(3)]);
    this.phone=new FormControl('',[Validators.required, Validators.pattern(Globals.singlePhoneRegex)]);
  }

  ngOnInit() {
  }


  public async mobileNoSearch(event) {
    if (event.keyCode != 13) return;

    // Query and field name and email
    var item = await this.invitationService.getVisitorFromMobile(this.model.visitor.phone);

    this.model.visitor.name = item["name"] ;
    this.model.visitor.email = item["email"] ;
  }

  public checkboxPurposes(elm, evt) {
    if (evt.srcElement.checked) {
      this.model.visitor.purpose = elm;
    }
  }

  public checkboxSendBy(elm, evt) {
    if (evt.srcElement.checked) {
      this.model.sendBy.push(elm);
    }
    else {
      var index = this.model.sendBy.indexOf(elm, 0);
      if (index > -1) {
        this.model.sendBy.splice(index, 1);
      }
    }
  }

  
  async save() {    
    try{
      console.log(this.model);
      this.progressService.start();
      var result = await this.invitationService.createInvitation(this.model);
      if (result) {
        this.result=true;
      }
    }finally{
      this.progressService.done();
    }
  }
}
