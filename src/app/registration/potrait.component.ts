import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// import ExifReader from 'exifreader';
import * as exif from 'jpeg-autorotate';

import { InvitationService } from 'app/service/invitation.service';
import { CommonService } from '../service/common.service';

// import { TranslateService } from 'ng2-translate';

//import { BaseClassComponent, BaseComponent } from 'app/shared/base-class-component';


@Component({
  templateUrl: 'potrait.component.html',
  //directives: FormControlDirective,
  styles: [`
      .table {
        display: table;
        width: 100%;
      }
      .table-cell {
        display: table-cell;
        vertical-align: middle;
      }
      .form-control-file {
        -ms-flex: 1 1 auto;
      }
      .blankPotrait {
        width: 188px;
        height: 197px;
      }

      .default {
        background-image: url('data:image/png;base64,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')
      }


      `]
})
export class PotraitComponent {
  @ViewChild("personForm") personForm: NgForm;

  private loading: Boolean = false;
  private visitorId: String = "";

  model: {
    "objectId": string,
    "potrait": string
  } =
  {
    "objectId": "",
    "potrait": ""
  };

  constructor(
    private router: Router,
    private invitationService: InvitationService,
    private commonService: CommonService
  ) {
    this.commonService.loadLanguage();
    var url = window.location.search;
    url = url.replace("?", '');
    console.log(url);

    var queries = url.split("&");
    var i = 0, l = queries.length, temp;
    for (i = 0, l = queries.length; i < l; i++) {
      temp = queries[i].split('=');
      if (temp[0] == "objectId") {
        this.model.objectId = temp[1];
        break;
      }
    }

    console.log(this.model.objectId);
  }

  imageListener($event): void {
    var me = this;

    var file: File = $event.target.files[0];
    if (file == null) return;

    me.model.potrait = "";

    // if (file.size > 1024000) {
    //   alert(file.size);
    //   return;
    // }

    var reader = new FileReader();
    reader.onload = async (e) => {
      var buf = new Buffer(reader.result.byteLength);
      var view = new Uint8Array(reader.result);
      for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
      }
      console.log("RotateImage") ;

      me.RotateImage(buf);

      if (me.model.potrait == "") {
        me.readImageBase64(file);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  RotateImage(file) {
    let me = this;

    let options = { quality: 85 }

    exif.rotate(file, options,
      function (error, buffer, orientation, dimensions) {
        if (error) {
          console.log('An error occurred when rotating the file: ' + error.message)
          return
        }

        me.model.potrait = buffer.toString('base64');

        console.log('Orientation was: ' + orientation)
        console.log('Height after rotation: ' + dimensions.height)
        console.log('Width after rotation: ' + dimensions.width)
      }
    );
  }

  readImageBase64(file) {
    var me = this;
    var myReader: FileReader = new FileReader();

      myReader.onloadend = async (e) => {
        //var image = new Image();
        var result = myReader.result as any;

        console.log("readAsDataURL") ;

        var pos = result.indexOf(";base64,");
        if (pos >= 0) {
          me.model.potrait = result.substring(pos + 8);
          console.log(me.model.potrait);
        }
      }
      myReader.readAsDataURL(file);
  }
  
  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    this.registerPotrait();
  }

  async registerPotrait() {
    var item = await this.invitationService.preRegistration(this.model);

    if (item) {
      // success
      this.router.navigate(['/registration/success']);
    }

  }
}
