import { OnInit, Component, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RoleOption } from "app/Interface/interface";

@Component({
  selector: 'create-edit-form',
  templateUrl: './create-edit-form.component.html',
  styles: [`
   
    .input-group.mb-1{     
     padding:2px 10px;     
    }
  `]
})
export class CreateEditFormComponent implements OnInit{
  

  private editMode = false;

  rolesArray: RoleOption[];
  myform: FormGroup;
  username: FormControl;  
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  passwordGroup: FormGroup;
  roles: FormControl;
  tempRoles: string[];
  
  constructor() {

  }
  public setRoles(rolesArray: string[]): void {
    this.rolesArray = [];
    for (let name of rolesArray) {
      let role = new RoleOption();
      role.name = name;
      role.checked = false;
      this.rolesArray.push(role);
    }
    
  }
 

  public getForm(): FormGroup{
    return this.myform;
  }
  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.tempRoles = [];
  }
  public setFormData(data: any, editMode: boolean) {
    this.myform.reset();
    this.editMode = editMode;
    this.username.setValue(data.username);
    //set all checked value
    for (let role of this.rolesArray) {
      let findIndex = data.roles.indexOf(role.name);
      role.checked = findIndex > -1;
    }
    this.confirmPassword.setValue("");
    this.password.setValue("");
    this.email.setValue(data.email);
    this.roles.setValue(data.roles);    
  }
  public getFormData(): any {
    return this.myform.value;
  }

  passwordMatchValidator(g: FormGroup) {
  return g.get('password').value === g.get('confirmPassword').value
    ? null : { 'mismatch': true };
  }

  createFormControls() {
    this.username = new FormControl('', Validators.required);    
    this.email = new FormControl('', [
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

    this.roles = new FormControl('', Validators.required );
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
      email: this.email,
      passwordGroup: this.passwordGroup,      
      roles: this.roles
    });
  }
}
