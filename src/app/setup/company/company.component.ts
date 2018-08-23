import { Component, OnInit } from '@angular/core';
import { BaseComponent, BaseClassComponent } from '../../shared/base-class-component';
import { DialogService } from 'ng2-bootstrap-modal';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent extends BaseClassComponent implements OnInit,BaseComponent {

  constructor(dialogService:DialogService, translateService:TranslateService) { 
    super(dialogService, translateService);
  }

  ngOnInit() {
  }

}
