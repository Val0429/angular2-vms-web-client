import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, Tablet } from 'app/infrastructure/interface';
import { TabletService } from 'app/service/tablet.service';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';

@Component({
  selector: 'app-create-edit-tablet',
  templateUrl: './create-edit-tablet.component.html',
  styleUrls: ['./create-edit-tablet.component.scss']
})
export class CreateEditTabletComponent  extends DialogComponent<CreateEditDialog, Tablet> implements CreateEditDialog{
  
  title: string;
  myform: FormGroup;

  ip: FormControl;
  port: FormControl;
  account: FormControl;
  password: FormControl;
  editMode: boolean;
  formData: Tablet;
  constructor(private tabletService: TabletService,     
    private progressService:NgProgress,
    dialogService: DialogService,     ) {
      super(dialogService);
      //initialization
    let initForm = new Tablet();
    this.setFormData(initForm, "Init Form", true);
     }
     async save():Promise<void> {
      try{      
        this.progressService.start();    
        //build data that will be sent to backend
        let formResult: Tablet = new Tablet(); 
        formResult.objectId = this.formData.objectId;     
        formResult.ip = this.myform.value.ip;
        formResult.port = this.myform.value.port;
        formResult.account = this.myform.value.account;
        formResult.password = this.myform.value.password;
        
        //close form with success
        this.result = formResult.objectId === "" ? await this.create(formResult): await this.update(formResult);
        this.close();  
      }//no catch, global error handle handles it
      finally{      
        this.progressService.done();
      }
    }
    async update(data:Tablet) {             
    
      console.log("update", data);           
      return await this.tabletService.update(data);
    }
    async create(data:Tablet):Promise<Tablet>  {    
      console.log("create", data);
      return await this.tabletService.create(data);
    }
  ngOnInit() {
  }
  setFormData(itemData: Tablet, title: string, editMode: boolean) {
    this.formData = Object.assign({}, itemData);
    this.title = title;
    this.editMode = editMode;
    this.createFormControls();
    this.createForm();    
  }
  createFormControls() {
    this.account = new FormControl(this.formData.account, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.ip = new FormControl(this.formData.ip, [
      Validators.required,
      Validators.pattern(Globals.ipRegex)
    ]);

    this.password = new FormControl(this.formData.password, [
      Validators.required,
      Validators.minLength(6)
    ]);    

    this.port = new FormControl(this.formData.port, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);
  }
  createForm() {
    this.myform = new FormGroup({
      ip: this.ip,
      port: this.port,
      account: this.account,
      password: this.password
    });
  }
}
