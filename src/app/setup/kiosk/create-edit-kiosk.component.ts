import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog } from 'app/Interface/interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-edit-kiosk',
  templateUrl: './create-edit-kiosk.component.html'  
})
export class CreateEditKioskComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog
{
  title: string;
  editMode: boolean;
  objectId: string;
  
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
    this.createFormControls();
    this.createForm();
  
  }

  public setFormData(kioskData: any, editMode: boolean) {
    this.myform.reset();

    this.objectId = kioskData.objectId;
    this.title = kioskData.title;
    this.editMode = editMode;
    this.username.setValue(kioskData.username);
    this.confirmPassword.setValue("");
    this.password.setValue("");

    this.kioskId.setValue(kioskData.data.kioskId);
    this.kioskName.setValue(kioskData.data.kioskName);
    
  }
  public getFormData(): any {
    var data = this.myform.value;
    //sets objectId back
    data.objectId = this.objectId;
    return data;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  createFormControls() {
    this.username = new FormControl('', [
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

    this.kioskId = new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.kioskName = new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]);

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
      data: this.data
    });
  }
}
