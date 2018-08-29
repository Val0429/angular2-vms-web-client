import { Component, OnInit} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CreateEditDialog, User, UserData, Role, Floor, BaseClass, Company, RoleEnum} from "app/Interface/interface";
import { DialogService, DialogComponent } from "ng2-bootstrap-modal";
import * as Globals from 'app/globals';
import { UserService } from "../../service/user.service";
import { FloorService } from "../../service/floor.service";
import { CommonService } from "../../service/common.service";
import { CompanyService } from "../../service/company.service";

@Component({
  selector: 'create-edit-user',
  templateUrl: './create-edit-user.component.html'
 
})
export class CreateEditUserComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog, OnInit{
  
  title: string;  
  editMode:boolean;
  formData: User;  
  roleOptions: Role[];
  floorOptions:Floor[];
  companyOptions:Company[];

  myform: FormGroup;
  phone: FormControl;
  company: FormControl;
  floor: FormControl;
  username: FormControl;  
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  passwordGroup: FormGroup;
  roles: FormControl;  
  data: FormGroup;  

  userIsSystemAdmin:boolean=false;
  public setFormData(userData: User, title: string, editMode: boolean) {
    console.log("setFormData");
    this.formData = Object.assign({}, userData);
    this.formData.data = Object.assign({}, userData.data ? userData.data : new UserData());
    this.formData.roles = Object.assign([], userData.roles);
    this.formData.data.floor = Object.assign([], userData.data && userData.data.floor ? userData.data.floor : []);
    this.formData.data.company = Object.assign({}, userData.data && userData.data.company ? userData.data.company : new Company());

    this.title = title;
    this.editMode = editMode;
    
    //binding data
    this.createFormControls();
    this.createForm();
  }
  constructor(private userService:UserService, 
    private floorService:FloorService, 
    private  commonService:CommonService, 
    private  companyService:CompanyService, 
    dialogService: DialogService) {
    super(dialogService);

    //initialization
    let initForm = new User();
    initForm.data = new UserData();
    initForm.roles = [];
    this.roleOptions=[];
    this.floorOptions=[];
    this.setFormData(initForm, "Init Form", true);
  }
  async ngOnInit(): Promise<void> {
    console.log("init dialog");
    let roles = await this.userService.getUserRole();
    //copy to role options
    for(let item of roles){
      //format it to role object first
      let role = new Role();
      role.name=item;
      this.roleOptions.push(role);
    }
    
    //options restriction
    if(this.userService.userIs(RoleEnum.Administrator) || this.userService.userIs(RoleEnum.SystemAdministrator)){
      this.companyOptions = await this.companyService.read("&paging.all=true");
      this.floorOptions = await this.floorService.read("&paging.all=true");
    }else{
      let currentUser = this.userService.getCurrentUser();
      console.log("current user", currentUser);
      this.companyOptions = [];
      if(currentUser.data && currentUser.data.company){
        this.companyOptions.push(currentUser.data.company);
      }
      this.floorOptions = Object.assign([], currentUser.data && currentUser.data.floor ? currentUser.data.floor : []);
    }
    
    

    //remove selected role from role options
    for(let role of this.formData.roles){
      let index = this.roleOptions.map(function(e){return e.name}).indexOf(role.name);
      if(index<0) continue;
      this.roleOptions.splice(index,1);
    }
    //remove selected floor from floor options
    for(let floor of this.formData.data.floor){
      let index = this.floorOptions.map(function(e){return e.objectId}).indexOf(floor.objectId);
      if(index<0) continue;
      this.floorOptions.splice(index,1);
    }
    this.userIsSystemAdmin = this.userService.userIs(RoleEnum.SystemAdministrator);

  }
  
  public getFormData(): User {
    let formResult = this.myform.value;    
    this.formData.username = formResult.username;
    this.formData.password = formResult.passwordGroup.password;
    this.formData.data = formResult.data;
    this.formData.email = formResult.email;
    //reformat
    this.formData.roles = formResult.roles;
    return this.formData;
  }

  passwordMatchValidator(g: FormGroup) {
  return g.get('password').value === g.get('confirmPassword').value
    ? null : { 'mismatch': true };
  }

  createFormControls() {
    this.floor = new FormControl(this.formData.data.floor);
    this.phone = new FormControl(this.formData.phone, [
      //Validators.required,
      Validators.pattern(Globals.singlePhoneRegex)
    ]);
    this.username = new FormControl(this.formData.username, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.email = new FormControl(this.formData.email, [
      //Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
      
    ]);
    this.company = new FormControl(this.formData.data.company.objectId,
      [Validators.required
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
      floor: this.floor,
      company: this.company
    });
  }
  save() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
  add(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean){
    console.log("add item:", item);
    this.commonService.addItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);
  }
  remove(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean) {
    console.log("remove item:", item);
    this.commonService.removeItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);
  }
  createForm() {
    this.myform = new FormGroup({      
      username: this.username,   
      phone: this.phone, 
      email: this.email, 
      data: this.data,
      passwordGroup: this.passwordGroup,      
      roles: this.roles
    });
  }
}
