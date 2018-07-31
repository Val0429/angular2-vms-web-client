import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from 'app/service/user.service';
import { RecognitionService } from 'app/service/recognition.service';

import { Face_Settings, Recognition_Settings } from 'app/Interface/interface';

@Component({
  templateUrl: 'face.component.html'
})
export class FaceComponent {
  @ViewChild('recognitionForm') recognitionForm: NgForm;

  public data: Recognition_Settings[] = [];

  model: {
    "title"?: string, "action": string, "buttom"?: string,
    "settings"?: Recognition_Settings
  } =
  {
    "title": "New User",
    "action": "New User",
    "buttom": "Create User",
    "settings": new Recognition_Settings()
  };

  constructor(private _userService: UserService, private _recognitionService: RecognitionService) {
    var me = this;
    setTimeout(async () => {
      let setting = await this._recognitionService.getFcsSettings();
      // [
      //   {
      //     "video_source_sourceid": "frontdoor",
      //     "video_source_location": "frontdoor",
      //     "video_source_type": "rtsp",
      //     "video_source_ip": "192.168.1.100",
      //     "video_source_port": 554,

      var settings = new Face_Settings().fromJSON(setting);

      this.data = settings.fcs_settings;
    }, 1000);
  }

  newRecognition() {
    //this.recognitionForm.reset();

    this.model.title = "New Recognition";
    this.model.action = "New";
    this.model.buttom = "Create";

    this.model.settings = new Recognition_Settings();

    this.data.push(this.model.settings);

    this.recognitionForm.submitted;
  }

  modifyRecognition(item) {
    //this.recognitionForm.reset();

    this.model.title = "Modify Recognition";
    this.model.action = "Modify";
    this.model.buttom = "Save";
    this.model.settings = item;

    this.recognitionForm.submitted;
  }

  async deleteRecognition(item) {
    var index = this.data.indexOf(item, 0);
    if (index > -1) {
      this.data.splice(index, 1);
    }
    
    var result = await this._recognitionService.modifyFcsSettings(JSON.stringify(this.data));
  }

  async onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    var result = await this._recognitionService.modifyFcsSettings(JSON.stringify(this.data));
  }

}