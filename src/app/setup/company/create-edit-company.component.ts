import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, Company, Floor, BaseClass } from '../../Interface/interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
import { FloorService } from '../../service/floor.service';
import { CommonService } from '../../service/common.service';
@Component({
  selector: 'app-create-edit-company',
  templateUrl: './create-edit-company.component.html'
})
export class CreateEditCompanyComponent  extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog, OnInit{
  
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
  constructor(private floorService:FloorService, private commonService:CommonService, dialogService: DialogService) {
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
  
  public getFormData(): Company {
    let formResult = this.myform.value;  
    this.formData.name=formResult.name;
    this.formData.contactPerson=formResult.contactPerson;
    this.formData.unitNumber=formResult.unitNumber;
    this.formData.contactNumber=formResult.contactNumber.split(',');    
    //set this value back the way backend wants it
    this.formData.floor= formResult.floor;
    return this.formData;
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

  save() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
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
