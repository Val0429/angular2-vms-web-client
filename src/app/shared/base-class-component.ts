import { DialogService } from "ng2-bootstrap-modal";
import { TranslateService } from "ng2-translate"
import { AlertComponent } from "app/dialog/alert/alert.component";
import * as Globals from "app/globals";

export interface BaseComponent {
  showAlert(message: string, title?: string): void;
  getLocaleString(key: string): string;
}

export class BaseClassComponent implements BaseComponent {
  activeLanguage: string;
  constructor(public dialogService: DialogService, public translateService: TranslateService) {
    //activate language service
    this.activeLanguage = localStorage.getItem(Globals.languageKey);
    var browserLanguage = window.navigator.language.toLowerCase();
    
    if (this.activeLanguage === null) {
      if (browserLanguage === "zh-tw" || browserLanguage === "en-us") {
        this.activeLanguage = browserLanguage;
      } else {
        this.activeLanguage = "en-us";
      }
    }

    this.translateService.setDefaultLang(this.activeLanguage);
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
