import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InvitationService } from 'app/service/invitation.service';
import { visitorProfile } from 'app/Interface/interface';

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
    "visitor": visitorProfile
  } =
  {
    "title": "New Person",
    "action": "New",
    "buttom": "Create Person",
    "sendBy": [],
    "visitor": new visitorProfile()
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
    private invitationService: InvitationService
    , private changeDetecorRef: ChangeDetectorRef
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

  public checkVisitorInfo(item: visitorProfile): visitorProfile {
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

    this.displayItems = [];
    this.activePage = 1;

    for (var i of this.listItems) {
      if (
        (i.phone.indexOf(this.filterQuery) > -1) ||
        (i.name.indexOf(this.filterQuery) > -1) ||
        (i.email.indexOf(this.filterQuery) > -1) ||
        (i.status.indexOf(this.filterQuery) > -1)
      )
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

    this.model.visitor = new visitorProfile();

    this.visitorForm.resetForm();
    this.changeDetecorRef.detectChanges();
  }

  // modifyInvitation(item) {
  //   this.model.visitor = new visitorProfile();
  //   this.visitorForm.resetForm();

  //   this.model.title = "Modify Invitation";
  //   this.model.action = "Modify";
  //   this.model.buttom = "Save";

  //   this.model.visitor = item;

  //   this.changeDetecorRef.detectChanges();
  // }

  async deleteInvitation(item) {
    if (item == null) return;

    var result = await this.invitationService.cancelInvitation(item);

    var index = this.data.indexOf(item, 0);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    this.saveInvitation();
  }

  async saveInvitation() {
    var me = this;

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
