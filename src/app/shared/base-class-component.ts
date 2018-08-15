import { DialogService } from "ng2-bootstrap-modal";
import { TranslateService } from "ng2-translate"
import { AlertComponent } from "app/dialog/alert/alert.component";

export interface BaseComponent {
  showAlert(message: string, title?: string): void;
  getLocaleString(key: string): string;
}

export class BaseClassComponent implements BaseComponent {
  constructor(public dialogService: DialogService, public translateService: TranslateService) {

  }
  showAlert(message: string, title?: string) {
    let disposable = this.dialogService.addDialog(AlertComponent, {
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
