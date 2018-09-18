import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, Company, Floor, BaseClass } from '../../Interface/interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
import { FloorService } from '../../service/floor.service';
import { CommonService } from '../../service/common.service';
import { NgProgress } from 'ngx-progressbar';
import { CompanyService } from '../../service/company.service';
@Component({
  selector: 'app-create-edit-company',
  templateUrl: './create-edit-company.component.html'
})
export class CreateEditCompanyComponent  extends DialogComponent<CreateEditDialog, Company> implements CreateEditDialog, OnInit{
  
  title: string;  
  editMode:boolean;
  formData: Company; 
  myform: FormGroup;
  unitNumber: FormControl;  
  contactNumber: FormControl;
  contactPerson: FormControl;
  name: FormControl;
  floor: FormControl;
  floorOptions : Floor[]=[];  
  showFloor:boolean=false;

  public setFormData(formData: Company, title: string, editMode: boolean) {       
    //copy this object to prevent back reference
    this.formData = Object.assign({}, formData);   
    this.formData.floor = Object.assign([], formData.floor);   
    
    this.title = title;
    this.editMode = editMode;
    
    //binding data
    this.createFormControls();
    this.createForm();
  }
  constructor(private floorService:FloorService, 
    private commonService:CommonService,
    private companyService:CompanyService,
    private progressService:NgProgress, 
    dialogService: DialogService) {
    super(dialogService);

    //initialization
    let initForm = new Company();
    initForm.contactNumber=[];
    this.setFormData(initForm, "Init Form", true);
  }
  async ngOnInit(): Promise<void> {
    //gets floor data
    this.floorOptions = await this.floorService.read("&paging.all=true");
    //remove selected floor from floor options
    for(let floor of this.formData.floor){
      let index = this.floorOptions.map(function(e){return e.objectId}).indexOf(floor.objectId);
      if(index<0) continue;
      this.floorOptions.splice(index,1);
    }
  }
  

  add(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean){
    console.log("add item:", item);
    this.commonService.addItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);
  }
  remove(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean) {
    console.log("remove item:", item);
    this.commonService.removeItemFromSelectedDropDown(item, selected, options, endResult, byObjectId);
  }
  createFormControls() {
    this.name = new FormControl(this.formData.name, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.contactPerson = new FormControl(this.formData.contactPerson, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.unitNumber = new FormControl(this.formData.unitNumber, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.unitNumber = new FormControl(this.formData.unitNumber, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.floor = new FormControl(this.formData.floor);
    this.contactNumber = new FormControl(this.formData.contactNumber.toString(), [
      Validators.required,      
      Validators.pattern(Globals.multiPhoneRegex)
    ]);
    
  }
  async update(data:Company) {
    console.log("update", data);    
    return await this.companyService.update(data);
  }
  async create(data:Company):Promise<Company>  {    
    console.log("create", data);
    return await this.companyService.create(data);
  }
  async save():Promise<void> {
    try{      
      this.progressService.start();    
      //build data that will be sent to backend
      let formResult: Company = new Company(); 
      formResult.objectId = this.formData.objectId;     
      formResult.name = this.myform.value.name;
      formResult.contactPerson = this.myform.value.contactPerson;
      formResult.unitNumber = this.myform.value.unitNumber;
      formResult.contactNumber = this.myform.value.contactNumber.split(',');
      formResult.floor = this.myform.value.floor;
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
      name: this.name,    
      unitNumber: this.unitNumber,
      contactPerson: this.contactPerson,
      contactNumber:this.contactNumber,
      floor:this.floor
    });
  }

}
