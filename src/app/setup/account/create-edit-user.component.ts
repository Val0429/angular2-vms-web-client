import { Component} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RoleOption, CreateEditDialog, User, UserData} from "app/Interface/interface";
import { DialogService, DialogComponent } from "ng2-bootstrap-modal";
import * as Globals from 'app/globals';

@Component({
  selector: 'create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styles: []
})
export class CreateEditUserComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog{
  phone: FormControl;
  name: FormControl;
  title: string;  
  editMode:boolean;
  tempRoles: string[];
  formData: User;  
  rolesArray: RoleOption[];

  myform: FormGroup;
  username: FormControl;  
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  passwordGroup: FormGroup;
  roles: FormControl;  
  data: FormGroup;  
  public setFormData(userData: User, title: string, rolesArray: string[], editMode: boolean) {
    this.formData = userData;

    this.rolesArray = [];
    for (let name of rolesArray) {
      let role = new RoleOption();
      role.name = name;
      role.checked = false;
      this.rolesArray.push(role);
    }

    this.title = title;
    this.editMode = editMode;

    //set all checked value
    for (let role of this.rolesArray) {
      let findIndex = userData.roles.map(function (e) { return e.name }).indexOf(role.name);
      role.checked = findIndex > -1;
    }
    //binding data
    this.createFormControls();
    this.createForm();
    this.tempRoles = [];
  }
  constructor(dialogService: DialogService) {
    super(dialogService);

    //initialization
    let initForm = new User();
    initForm.data = new UserData();
    initForm.roles = [];
    this.setFormData(initForm, "Init Form", [], true);
  }
  
  public getFormData(): User {
    let formResult = this.myform.value;    
    this.formData.username = formResult.username;
    this.formData.password = formResult.passwordGroup.password;
    this.formData.data = formResult.data;
    //reformat
    this.formData.roles = formResult.roles;
    return this.formData;
  }

  passwordMatchValidator(g: FormGroup) {
  return g.get('password').value === g.get('confirmPassword').value
    ? null : { 'mismatch': true };
  }

  createFormControls() {
    this.name = new FormControl(this.formData.data.name, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.phone = new FormControl(this.formData.data.phone, [
      Validators.required,
      Validators.pattern(Globals.singlePhoneRegex)
    ]);
    this.username = new FormControl(this.formData.username, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.email = new FormControl(this.formData.data.email, [
      //Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
      
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

    this.roles = new FormControl(this.formData.roles.map(function (e) { return e.name }), Validators.required);
    this.data = new FormGroup({
      email: this.email,
      name: this.name,
      phone: this.phone
    });
  }
  save() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
  addRemoveRole(checked: boolean, value:string) {
    console.log("clicked role:", checked, value);
    //assign checked value to temp role 
    if (checked) {
      this.tempRoles.push(value);
    }      
    else {
      let findIndex = this.tempRoles.indexOf(value);
      if (findIndex>-1)
        this.tempRoles.splice(findIndex, 1);
    }

    //sets value to roles array
    var existingIndex = this.rolesArray.map(function (e) { return e.name }).indexOf(value);
    this.rolesArray[existingIndex].checked = checked;

    this.roles.setValue(this.tempRoles);
  }
  createForm() {
    this.myform = new FormGroup({      
      username: this.username,    
      data: this.data,
      passwordGroup: this.passwordGroup,      
      roles: this.roles
    });
  }
}
