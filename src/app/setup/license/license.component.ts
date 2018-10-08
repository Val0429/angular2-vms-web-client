import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import { LicenseService } from '../../service/license.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {

  constructor(
    private commonService:CommonService, 
    private licenseService:LicenseService,
    private progressService:NgProgress
  ) { }

  ngOnInit() {
  }

}
