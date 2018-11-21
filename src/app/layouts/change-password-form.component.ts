import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { User } from 'app/infrastructure/interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html'
})
export class ChangePasswordFormComponent extends DialogComponent<any, boolean>   {
  
  phone: FormControl;
  name: FormControl;
  myform: FormGroup;
  username: FormControl;
  newPassword: FormControl;
  // password: FormControl;
  confirmPassword: FormControl;
  passwordGroup: FormGroup;
  

  public setFormData(userName: string) {    
    //binding data
    this.createFormControls(userName);
    this.createForm();
    
  }
  constructor(dialogService: DialogService) {
    super(dialogService);
    this.createFormControls("Init Form");
    this.createForm();
  }

  public getFormData(): any {
    return this.myform.value;    
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  createFormControls(userName: string) {
    this.username = new FormControl(userName, [
      Validators.required
    ]);
    this.newPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(6)  
    ]);

    // this.password = new FormControl('', [
    //   Validators.required
    // ]);
    this.confirmPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);

    this.passwordGroup = new FormGroup({
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }, this.passwordMatchValidator);

    
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
      // password: this.password
    });
  }
}
