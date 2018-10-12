import { Component, OnInit } from '@angular/core';
import { InvitationService } from 'app/service/invitation.service';
import { NgProgress } from 'ngx-progressbar';
import { Visitor } from 'app/Interface/interface';


@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit {

  data:Visitor[];
  tempData:Visitor[];
  filterQuery: string;
  constructor(private invitationService:InvitationService, private progressService:NgProgress) { 
    
  }
  public searchKeyUp(event) {
    if (event.keyCode != 13) return;

    this.doSearch();
  }

  private doSearch() {
    let filter = this.filterQuery.toLowerCase();
    this.data = [];
    for (let item of this.tempData) {
      if (item.name.toLowerCase().indexOf(filter) > -1 || item.phone.toLowerCase().indexOf(filter) > -1 || item.email.toLowerCase().indexOf(filter) > -1) {
        this.data.push(item);
      }
    }
  }
  async ngOnInit() {
    try{
      this.progressService.start();      
      let items = await this.invitationService.getVisitors("");
      this.data= Object.assign([],items);
      this.tempData= Object.assign([],items);      
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    } 
  }

}
