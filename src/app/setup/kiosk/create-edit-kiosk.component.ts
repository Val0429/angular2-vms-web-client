import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, KioskUser, KioskData } from 'app/Interface/interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-edit-kiosk',
  templateUrl: './create-edit-kiosk.component.html'  
})
export class CreateEditKioskComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog
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
  
  constructor(dialogService: DialogService) {
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
  public getFormData(): KioskUser {
    var result = this.myform.value;

    this.formData.username = result.username;      
    this.formData.password = result.passwordGroup.password;
    this.formData.data = result.data;
    this.formData.roles = result.roles;
    
    return this.formData;
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
  save() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
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
