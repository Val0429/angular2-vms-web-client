import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { InvitationService } from 'app/service/invitation.service';
import { VisitorProfile } from 'app/Interface/interface';
import { NgProgress } from 'ngx-progressbar';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';

@Component({
  templateUrl: 'invitation.component.html',
  styleUrls: ["./invitation.component.scss"]
})

export class InvitationComponent implements OnInit {
  
  condition: {
    "mobileNo": string,
    "visitorName": string,
    "emailAddress": string,
    "beginDatetime": String,
    "endDatetime": String
    "status": string[],
  } = {
    "mobileNo": "",
    "visitorName": "",
    "emailAddress": "",
    "status": [],
    "beginDatetime": "",
    "endDatetime": ""
  }

  private listItems = [];
  private displayItems = [];
  public data = [];
  public rowsOnPage = 10;
  public activePage = 1;
  public itemsTotal = 0;

  public purposes = [];

  public filterQuery = '';

  

  constructor(
    private invitationService: InvitationService, 
    private progressService:NgProgress,
    private dialogService:DialogService
  ) {

  }

  async ngOnInit() {
    

    this.purposes = await this.invitationService.getPurposesList();

    this.listItems = await this.invitationService.getInvitationList();
    this.displayItems = this.listItems;
    this.itemsTotal = this.displayItems.length;

    this.loadData();
  }
  checkboxInvitationStatus(elm, evt) {
    if (evt.srcElement.checked) {
      this.condition.status.push(elm);
    }
    else {
      var index = this.condition.status.indexOf(elm, 0);
      if (index > -1) {
        this.condition.status.splice(index, 1);
      }
    }
  }
  public loadData() {
    var start = (this.activePage - 1) * this.rowsOnPage;
    var items = this.displayItems.slice(start, start + this.rowsOnPage);

    this.data = [];
    for (let item of items) {
      item = this.checkVisitorInfo(item);

      this.data.push(item);
    }
  }

  public checkVisitorInfo(item: VisitorProfile): VisitorProfile {
    if (item.phone == undefined)
      item.phone = '';

    if (item.name == undefined)
      item.name = '';

    if (item.email == undefined)
      item.email = '';

    return item;
  }

  public dateToDateString(dd: Date): string {
    if (dd == null) return "";

    var year = dd.getFullYear();
    var month = dd.getMonth() < 9 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); // getMonth() is zero-based
    var date = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();

    return year + '/' + month + '/' + date;
  }

  public onPageChange(event) {
    this.rowsOnPage = event.rowsOnPage;
    this.activePage = event.activePage;
    this.loadData();
  }


  public searchKeyUp(event) {
    if (event.keyCode != 13) return;

    this.doSearch();
  }

  private doSearch() {
    this.displayItems = [];
    this.activePage = 1;
    let filter = this.filterQuery.toLowerCase();
    for (var i of this.listItems) {
      if ((i.phone.indexOf(filter) > -1) ||
        (i.nathis.toLowerCase().indexOf(filter) > -1) ||
        (i.email.toLowerCase().indexOf(filter) > -1) ||
        (i.status.indexOf(filter) > -1))
        this.displayItems.push(i);
    }
    this.itemsTotal = this.displayItems.length;
    this.loadData();
  }


  public async invitationsSearch(event) {
    

    this.listItems = await this.invitationService.getSearchInvitationList(this.condition);

    this.displayItems = this.listItems;
    this.itemsTotal = this.displayItems.length;

    this.loadData();
  }
 

 

  async deleteInvitation(item) {
    if (item == null) return;
    console.log("delete", item);

    this.dialogService.addDialog(ConfirmComponent, {
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (!isConfirmed) return;
        try{
          this.progressService.start();
          var result = await this.invitationService.cancelInvitation(item);
          var index = this.data.indexOf(item, 0);
          if (index > -1) {
            this.data.splice(index, 1);
          }
        }finally{
          this.progressService.done();
        }
    });
  }


  
}
