import { Injectable } from '@angular/core';
import { AlertComponent } from '../dialog/alert/alert.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { TranslateService } from 'ng2-translate';



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
}