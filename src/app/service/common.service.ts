import { Injectable } from '@angular/core';
import { AlertComponent } from '../dialog/alert/alert.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { TranslateService } from 'ng2-translate';
import { BaseClass } from '../Interface/interface';
import { FormControl } from '@angular/forms';



@Injectable()
export class CommonService{
    constructor(private dialogService: DialogService, private translateService: TranslateService) {
        
      }
      showAlert(message: string, title?: string) {
        this.dialogService.addDialog(AlertComponent, {
          title: title,
          message: message
        })
          .subscribe((isConfirmed) => {
            //We get dialog result
          });
      }
      getLocaleString(key: string): string {
        var result = "";
        this.translateService.get(key).subscribe((value: string) => {
          result = value;;
        });
        return result;
      }
      addItemFromSelectedDropDown(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean){
        
        let index = selected.map(function(e){return e.objectId}).indexOf(item.objectId);
        let optionIndex = options.map(function(e){return e.objectId}).indexOf(item.objectId);    
        //assign checked value to temp role 
        if (index==-1) {
          selected.push(item);
          options.splice(optionIndex,1);
        } 
        //map the way backend wants it
        endResult.setValue(selected.map(function (e) { return byObjectId ? e.objectId : e.name }));
      }
      removeItemFromSelectedDropDown(item: BaseClass, selected:BaseClass[], options:BaseClass[], endResult:FormControl, byObjectId?:boolean) {        
        let index = selected.map(function (e) { return e.objectId }).indexOf(item.objectId);
        let optionIndex = options.map(function (e) { return e.objectId }).indexOf(item.objectId);    
        //assign checked value  
        if (optionIndex==-1) {
          options.push(item);
          selected.splice(index, 1);
        } 
        //map the way backend wants it
        endResult.setValue(selected.map(function (e) { return byObjectId ? e.objectId : e.name }));
      }
}