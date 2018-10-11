import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InvitationService } from 'app/service/invitation.service';
import { VisitorProfile } from 'app/Interface/interface';
import { NgProgress } from 'ngx-progressbar';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';

@Component({
  templateUrl: 'invitation.component.html'
})

export class InvitationComponent implements OnInit {
  @ViewChild("visitorForm") visitorForm: NgForm;

  private listItems = [];
  private displayItems = [];
  public data = [];
  public rowsOnPage = 10;
  public activePage = 1;
  public itemsTotal = 0;

  public purposes = [];

  public filterQuery = '';

  model: {
    "title"?: string, "action": string, "buttom"?: string,
    "sendBy": string[],
    "visitor": VisitorProfile
  } =
  {
    "title": "New Person",
    "action": "New",
    "buttom": "Create Person",
    "sendBy": [],
    "visitor": new VisitorProfile()
  };

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

  constructor(
    private invitationService: InvitationService, 
    private changeDetecorRef: ChangeDetectorRef,
    private progressService:NgProgress,
    private dialogService:DialogService
  ) {

  }

  async ngOnInit() {
    var me = this;

    me.purposes = await this.invitationService.getPurposesList();

    me.listItems = await this.invitationService.getInvitationList();
    me.displayItems = me.listItems;
    me.itemsTotal = me.displayItems.length;

    me.loadData();
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

    var _y = dd.getFullYear();
    var _m = dd.getMonth() < 9 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); // getMonth() is zero-based
    var _d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();

    return _y + '/' + _m + '/' + _d;
  }

  public onPageChange(event) {
    this.rowsOnPage = event.rowsOnPage;
    this.activePage = event.activePage;
    this.loadData();
  }

  public async mobileNoSearch(event) {
    if (event.keyCode != 13) return;

    // Query and field name and email
    var item = await this.invitationService.getVisitorFromMobile(this.model.visitor.phone);

    this.model.visitor.name = item["name"] ;
    this.model.visitor.email = item["email"] ;
  }

  public checkboxPurposes(elm, evt) {
    if (evt.srcElement.checked) {
      this.model.visitor.purpose = elm;
    }
  }

  public checkboxSendBy(elm, evt) {
    if (evt.srcElement.checked) {
      this.model.sendBy.push(elm);
    }
    else {
      var index = this.model.sendBy.indexOf(elm, 0);
      if (index > -1) {
        this.model.sendBy.splice(index, 1);
      }
    }
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
        (i.name.toLowerCase().indexOf(filter) > -1) ||
        (i.email.toLowerCase().indexOf(filter) > -1) ||
        (i.status.indexOf(filter) > -1))
        this.displayItems.push(i);
    }
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

  public async invitationsSearch(event) {
    var me = this;

    me.listItems = await this.invitationService.getSearchInvitationList(this.condition);

    me.displayItems = me.listItems;
    me.itemsTotal = me.displayItems.length;

    me.loadData();
  }
 

  newInvitation() {
    this.model.title = "New Invitation";
    this.model.action = "New";
    this.model.buttom = "Create";

    this.model.visitor = new VisitorProfile();

    this.visitorForm.resetForm();
    this.changeDetecorRef.detectChanges();
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

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    this.saveInvitation();
  }

  async saveInvitation() {
    

    console.log(this.model);

    if (this.model.action == "New") {
      var result = await this.invitationService.createInvitation(this.model);

      if (result) {
        this.listItems.push(result);
        this.loadData();
      }
    }
  }
}
