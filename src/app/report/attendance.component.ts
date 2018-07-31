import { Component, Input, Output, EventEmitter } from '@angular/core';

import { UserService } from 'app/service/user.service';
import { ReportService } from 'app/service/report.service';

import { Person, Person_Info, Verify_Result } from 'app/Interface/interface';

import { DatepickerModule } from 'ng2-bootstrap';

import * as FileSaver from 'file-saver';
import * as Excel from 'exceljs';


@Component({
  templateUrl: 'attendance.component.html',
  // styles: [`
  // .inputKey {
  //   width: 100px;
  //   margin-left:5px;
  //   margin-right:5px;
  // }
  // .form-control-file {
  //   -ms-flex: 1 1 auto;
  // }
  // `]
})
export class AttendanceComponent {
  public data = [];

  // private persons: Person[] = [];
  // private dates: number[] = [];

  model: {
    "startdate"?: Date, "enddate": Date
  } =
  {
    "startdate": new Date(new Date().setHours(0, 0, 0, 0) - 86400000),
    "enddate": new Date(new Date().setHours(0, 0, 0, 0) - 86400000)
  };

  constructor(private _userService: UserService, private _reportService: ReportService) { }

  TimecodeToDateString(timecode: number): string {
    if (timecode == null) return "";

    var dd = new Date(timecode);
    var _y = dd.getFullYear();
    var _m = dd.getMonth() < 9 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); // getMonth() is zero-based
    var _d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();

    return _y + '/' + _m + '/' + _d;
  }

  TimecodeToTimeString(timecode: number): string {
    if (timecode == null) return "";

    var dd = new Date(timecode);
    var _h = dd.getHours() < 10 ? "0" + dd.getHours() : dd.getHours();
    var _m = dd.getMinutes() < 10 ? "0" + dd.getMinutes() : dd.getMinutes();
    var _s = dd.getSeconds() < 10 ? "0" + dd.getSeconds() : dd.getSeconds();
    
    return _h + ':' + _m + ':' + _s ;
  }

  TimecodeToDurationString(timecode1: number, timecode2: number): string {
    if (timecode1 == null) return "";
    if (timecode2 == null) return "";

    return this.TimecodeToTimeString(Math.abs(timecode1 - timecode2) + this.model.startdate.getTime());
  }

  async validateSearch() {
    var _startDate = this.model.startdate.getTime();
    var _endDate = this.model.enddate.getTime() + 86399999;

    // 1.0 get Face Channel Setting
    let cc = await this._reportService.getFcsSttings();

    // 2.0 Get All Person
    // let pp = await this._userService.getPersonsList();

    // for (var person of pp) {
    //   this.persons.push(new Person().fromResult(person));
    // }

    // // 3.0 Rearrangement DateTime
    // var a = 0;
    // while (_startDate + (a * 86400000) <= _endDate) {
    //   this.dates.push(_startDate + (a * 86400000));
    //   a++;
    // }

    // for (var p of this.persons) {
    //   for (var d of this.dates) {
    //     this.data.push(JSON.parse(`{
    //       "person":` + JSON.stringify(p) + `, "datecode":"` + d + `", "date":"` + this.TimecodeToDateString(d) + `",
    //       "firsttime":null, "firstsnapsnot":null, "firstface":null, "firstchannel":"",
    //       "lasttime":null , "lastsnapsnot":null , "lastface":null , "lastchannel":"" 
    //     }`));
    //   }
    // }

    // 4.0 Fill in validate Time
    this.data = await this._reportService.getVerifyResultList(_startDate, _endDate);
    // let items = await this._reportService.getVerifyResultList(_startDate, _endDate);

    // for (var item of items) {
    //   "person_info": {
    //     "fullname": "Ken"
    //   },
    //   "person_id": "5af90788aec09339bf13827c",
    //   "score": 0.992895,
    //   "target_score": 0.8,
    //   "snapshot": "i1526269892229_9a154f07a5004a06.jpg",
    //   "channel": "test",
    //   "timestamp": 1526269892229,
    //   "verify_face_id": "5af907c4aec09339bf138491",
    //   "action_enable": 1,

    //   var record = new Verify_Result().fromJSON(item);

    //   for (var row of this.data) {
    //     if (row["person"]["id"] == record.person_id) { // find Person
    //       if (Math.abs(row["datecode"] - record.timestamp) < 86400000) {// find Date
    //         // Empty => first
    //         if (row["firsttime"] == null) {
    //           row["firsttime"] = record.timestamp;
    //           row["firstsnapsnot"] = record.snapshot;
    //           row["firstface"] = record.verify_face_id;
    //           row["firstchannel"] = record.channel;
    //         }
    //         else {
    //           if (record.timestamp > row["firsttime"]) {
    //             // Bigger 

    //             if (record.timestamp > row["lasttime"]) {
    //               row["lasttime"] = record.timestamp;
    //               row["lastsnapsnot"] = record.snapshot;
    //               row["lastface"] = record.verify_face_id;
    //               row["lastchannel"] = record.channel;
    //             }
    //             else {
    //               // ignore, nothing to do
    //             }
    //           }
    //           else {
    //             // Small => Set last = first, set to first  
    //             row["lasttime"] = row["firsttime"];
    //             row["lastsnapsnot"] = row["firstsnapsnot"];
    //             row["lastface"] = row["firstface"];
    //             row["lastchannel"] = row["firstchannel"];

    //             row["firsttime"] = record.timestamp;
    //             row["firstsnapsnot"] = record.snapshot;
    //             row["firstface"] = record.verify_face_id;
    //             row["firstchannel"] = record.channel;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    // 5.0 Mapping Channel Location
    for (var c of cc) {
      var sourceid = c["video_source_sourceid"];
      var location = c["video_source_location"];

      for (var row of this.data) {
        if (row["channel"] == sourceid)
          row["channel"] = location;
      }
    }

    // 6.0 Load Face Image
    for (var row of this.data) {
      if (row["snapshot"] != null) {
        row["base64"] = this._userService.getSnapshotByFaceId(row["snapshot"]);
      }

      if (row["snapshot"] != null) {
         row["snapshot"] = this._userService.getSnapshotByFaceId(row["snapshot"]);
      }
    }
  }

  exportExl() {
    var thead = `<thead><tr>
      <th style="width:150px">No</th>
      <th style="width:150px">Date</th>
      <th style="width:150px">Time</th>
      <th style="width:150px">Location</th>
      <th style="width:150px">Employee No</th>
      <th style="width:150px">Photo</th>
    </tr></thead>`;

    var tbody = `<tbody>`;
    var no = 1;
    for (var item of this.data) {
      var row = `<tr style="height:110px;">`;
      row += "<td>" + no + "</td>";
      row += "<td>" + this.TimecodeToDateString(item["timestamp"]) + "</td>";
      row += "<td>" + this.TimecodeToTimeString(item["timestamp"]) + "</td>";
      row += "<td>" + item["channel"] + "</td>";
      row += "<td>" + item["person_info"]["employeeno"] + "</td>";
      
      if (item.snapshot == null)
        row += "<td></td>" ;
      else 
        row += "<td><img src=\"" + item.snapshot + "\" width=\"100\" height=\"100\"></td>";

      row += "</tr>";

      tbody += row;
      no++;
    }
    tbody += "</tbody>";

    var table = "<table>" + thead + tbody + "</table>";

    var blob = new Blob([table], {
      //type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      type: "application/vnd.ms-excel;charset=utf-8"

    });
    FileSaver.saveAs(blob, "AttendanceReport.xls");
  }

  getBase64Image(id, mode) {
    // var me = this;
    // var img = <HTMLImageElement>window.document.getElementById(id + '_' + mode);
    //     //img.crossOrigin = "anonymous";
    //     img.setAttribute("crossOrigin",'anonymous')

    // if (img != null) {
    //   console.log(img.width);

    //   var canvas = document.createElement("canvas");
    //   //canvas.width = 100;
    //   //canvas.height = 100;
    //   var ctx = canvas.getContext("2d");
    //   ctx.drawImage(img, 100, 100);
    //   var dataURL = canvas.toDataURL("image/jpg");
    //       dataURL = dataURL.replace(/^data:image\/(png|jpg|jpeg|pdf);base64,/, "");
    //   return dataURL;
    // }
    // else {
    //   return "";
    // }

    var me = this;
    var htmlaTag = <HTMLImageElement>window.document.getElementById(id + '_' + mode);
    var uri = htmlaTag.src;

    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/jpg");

      alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };
    img.src = uri;
  }
}