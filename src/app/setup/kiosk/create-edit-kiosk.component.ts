import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, KioskUser, KioskData } from 'app/infrastructure/interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { KioskService } from '../../service/kiosk.service';

@Component({
  selector: 'app-create-edit-kiosk',
  templateUrl: './create-edit-kiosk.component.html'  
})
export class CreateEditKioskComponent extends DialogComponent<CreateEditDialog, KioskUser> implements CreateEditDialog
{
  roles: FormControl;
  title: string;
  editMode: boolean;
  formData: KioskUser;
  
  myform: FormGroup;
  username: FormControl;
  kioskId: FormControl;
  kioskName: FormControl;
  data: FormGroup;
  password: FormControl;
  confirmPassword: FormControl;
  passwordGroup: FormGroup;
  
  constructor(private kioskService:KioskService,private progressService:NgProgress, dialogService: DialogService) {
    super(dialogService);
    //initialization
    let initForm = new KioskUser();
    initForm.data = new KioskData();
    initForm.roles = [];
    this.setFormData(initForm, "Init Form", true);
  }

  public setFormData(kioskData: KioskUser, title:string, editMode: boolean) {

    this.formData = Object.assign({}, kioskData);
    this.formData.data = Object.assign({}, kioskData.data);
    
    this.title = title;
    this.editMode = editMode;
    this.createFormControls();
    this.createForm();
    
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  createFormControls() {
    this.username = new FormControl(this.formData.username, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);

    this.confirmPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);

    this.passwordGroup = new FormGroup({
      password: this.password,
      confirmPassword: this.confirmPassword
    }, this.passwordMatchValidator);

    this.kioskId = new FormControl(this.formData.data.kioskId, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.kioskName = new FormControl(this.formData.data.kioskName, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.roles = new FormControl(this.formData.roles.map(function (e) { return e.name }), Validators.required);
    this.data = new FormGroup({
      kioskId:this.kioskId,
      kioskName:this.kioskName
    });
  }
  async update(data:KioskUser) {             
    //update data without update password by admin
    if (data.password === "") {
      //removes password from object submission
      delete (data.password);
    }
    console.log("update", data);           
    return await this.kioskService.update(data);
  }
  async create(data:KioskUser):Promise<KioskUser>  {    
    console.log("create", data);
    return await this.kioskService.create(data);
  }
  async save():Promise<void> {
    try{      
      this.progressService.start();    
      //build data that will be sent to backend
      let formResult: KioskUser = new KioskUser(); 
      formResult.objectId = this.formData.objectId;     
      formResult.username = this.myform.value.username;
      formResult.password = this.myform.value.passwordGroup.password;
      formResult.data = this.myform.value.data;  
      formResult.roles=[];    
      formResult.roles.push("Kiosk" as any);      
      //close form with success
      this.result = formResult.objectId === "" ? await this.create(formResult): await this.update(formResult);
      this.close();  
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  
  createForm() {
    this.myform = new FormGroup({
      username: this.username,      
      passwordGroup: this.passwordGroup,
      data: this.data,
      roles: this.roles
    });
  }
}
