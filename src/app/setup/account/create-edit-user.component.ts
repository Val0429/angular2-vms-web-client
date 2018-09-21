import { Component, OnInit} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CreateEditDialog, User, UserData, Role, Floor, BaseClass, Company, RoleEnum} from "app/Interface/interface";
import { DialogService, DialogComponent } from "ng2-bootstrap-modal";
import * as Globals from 'app/globals';
import { UserService } from "../../service/user.service";
import { FloorService } from "../../service/floor.service";
import { CommonService } from "../../service/common.service";
import { CompanyService } from "../../service/company.service";
import { NgProgress } from "ngx-progressbar";

@Component({
  selector: 'create-edit-user',
  templateUrl: './create-edit-user.component.html'
 
})
export class CreateEditUserComponent extends DialogComponent<CreateEditDialog, User> implements CreateEditDialog, OnInit{
  
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
    private commonService:CommonService, 
    private companyService:CompanyService, 
    private progressService:NgProgress,
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
    let id=0;
    for(let item of roles){
      //format it to role object first
      //TODO: ask Backend to return object instead of string array
      let role = new Role();
      role.objectId = (id++).toString();
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
    
    //add dummy select company as placeholder
    let selectCompany = new Company();
    selectCompany.name = this.commonService.getLocaleString("common.select")+ " " +this.commonService.getLocaleString("pageAccount.companyName");
    selectCompany.objectId="";
    this.companyOptions.unshift(selectCompany);

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

  passwordMatchValidator(g: FormGroup) {
  return g.get('password').value === g.get('confirmPassword').value
    ? null : { 'mismatch': true };
  }
  onCompanyChange(value :any){
    this.checkCompanyAndFloorValidator();
  }
  createFormControls() {
    this.floor = new FormControl(this.formData.data.floor ? this.formData.data.floor : []);
    this.phone = new FormControl(this.formData.phone ? this.formData.phone : [], [
      //Validators.required,
      Validators.pattern(Globals.singlePhoneRegex)
    ]);
    this.username = new FormControl(this.formData.username, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.email = new FormControl(this.formData.publicEmailAddress?this.formData.publicEmailAddress:"", [
      //Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
      
    ]);
    this.company = new FormControl(this.formData.data.company && this.formData.data.company.objectId ? this.formData.data.company.objectId:"");
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
  async update(data:User) {             
    //update data without update password by admin
    if (data.password === "") {
      //removes password from object submission
      delete (data.password);
    }
    console.log("update", data);           
    return await this.userService.update(data);
  }
  async create(data:User):Promise<User>  {    
    console.log("create", data);
    return await this.userService.create(data);
  }
  async save():Promise<void> {
    try{      
      this.progressService.start();    
      //build data that will be sent to backend
      let formResult: User = new User(); 
      formResult.objectId = this.formData.objectId;     
      formResult.username = this.myform.value.username;
      formResult.password = this.myform.value.passwordGroup.password;
      formResult.data = this.myform.value.data;
      formResult.publicEmailAddress = this.myform.value.email;  
      formResult.roles = this.myform.value.roles;      
      //close form with success
      this.result = formResult.objectId === "" ? await this.create(formResult): await this.update(formResult);
      this.close();  
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  add(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean){
    
    console.log("add item:", item);
    this.commonService.addItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);
    //company and floor are required for tenant admin and user
    this.checkCompanyAndFloorValidator();
  }
  private checkCompanyAndFloorValidator() {
    let selectedRoles = this.formData.roles.map(function (e) { return e.name; });
    if (selectedRoles.indexOf(RoleEnum[RoleEnum.TenantAdministrator]) > -1 || selectedRoles.indexOf(RoleEnum[RoleEnum.TenantUser]) > -1) {
      this.company.setValidators([Validators.required]);
      this.floor.setValidators([Validators.required]);
    }
    else {
      this.company.setValidators([]);
      this.floor.setValidators([]);
    }
    this.company.updateValueAndValidity();
    this.floor.updateValueAndValidity();
  }

  remove(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean) {
    console.log("remove item:", item);
    this.commonService.removeItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);    
    //company is required for tenant admin and user
    this.checkCompanyAndFloorValidator();
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
