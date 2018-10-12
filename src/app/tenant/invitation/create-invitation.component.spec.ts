import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvitationComponent } from './create-invitation.component';
import { AppTestModule } from 'app/app.module.test';

describe('CreateInvitationComponent', () => {
  let component: CreateInvitationComponent;
  let fixture: ComponentFixture<CreateInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ CreateInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
