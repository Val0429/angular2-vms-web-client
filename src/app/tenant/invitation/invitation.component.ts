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

  public filterQuery = '';

  model: {
    "title"?: string, "action": string, "buttom"?: string,
    "sendBy": string,
    "visitor": visitorProfile
  } =
  {
    "title": "New Person",
    "action": "New",
    "buttom": "Create Person",
    "sendBy": "email",
    "visitor": new visitorProfile()
  };

  condition: {
    "mobileNo": string,
    "visitorName": string,
    "emailAddress": string,
    "beginDatetime": String,
    "endDatetime": String
  } = {
    "mobileNo": "",
    "visitorName": "",
    "emailAddress": "",
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

    me.listItems = await this.invitationService.getInvitationList();
    me.displayItems = me.listItems;
    me.itemsTotal = me.displayItems.length;

    me.loadData();
  }


  public checkVisitorInfo(item: visitorProfile): visitorProfile {
    if (item.mobileNo == undefined)
      item.mobileNo = '';

    if (item.visitorName == undefined)
      item.visitorName = '';

    if (item.emailAddress == undefined)
      item.emailAddress = '';

    return item;
  }

  public loadData() {
    var start = (this.activePage - 1) * this.rowsOnPage + 1;
    var items = this.displayItems.slice(start, start + this.rowsOnPage);

    this.data = [];
    for (let item of items) {
      item = this.checkVisitorInfo(item);

      this.data.push(item);
    }
  }

  public onPageChange(event) {
    this.rowsOnPage = event.rowsOnPage;
    this.activePage = event.activePage;
    this.loadData();
  }

  public mobileNoSearch(event) {
    if (event.keyCode != 13) return;

    // Query and field name and email
  }

  checkboxPurpose(elm, evt) {
    if (evt.srcElement.checked) {
      this.model.visitor.purposeOfVisit = elm;
    }
  }

  checkboxSendBy(elm, evt) {
    if (evt.srcElement.checked) {
      this.model.sendBy = elm;
    }
  }

  public itemSearch(event) {
    if (event.keyCode != 13) return;

    this.displayItems = [];
    this.activePage = 1;

    for (var i of this.listItems) {
      i = this.checkVisitorInfo(i);

      if (
        (i.mobileNo.indexOf(this.filterQuery) > -1) ||
        (i.visitorName.indexOf(this.filterQuery) > -1) ||
        (i.emailAddress.indexOf(this.filterQuery) > -1)
      )
        this.displayItems.push(i);
    }

    this.itemsTotal = this.displayItems.length;
    this.loadData();
  }

  newInvitation() {
    this.model.title = "New Invitation";
    this.model.action = "New";
    this.model.buttom = "Create";

    this.model.visitor = new visitorProfile();

    this.visitorForm.resetForm();
    this.changeDetecorRef.detectChanges();
  }

  modifyInvitation(item) {
    this.model.visitor = new visitorProfile();
    this.visitorForm.resetForm();

    this.model.title = "Modify Invitation";
    this.model.action = "Modify";
    this.model.buttom = "Save";

    this.model.visitor = item;

    this.changeDetecorRef.detectChanges();
  }

  async deleteInvitation(item) {
    var result = await this.invitationService.updateInvitation(item);

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

    this.savePerson();
  }

  async savePerson() {
    var me = this;

  }
}
