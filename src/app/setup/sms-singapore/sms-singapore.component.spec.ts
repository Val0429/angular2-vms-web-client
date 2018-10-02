import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSingaporeComponent } from './sms-singapore.component';
import { AppTestModule } from '../../app.module.test';

describe('SmsSingaporeComponent', () => {
  let component: SmsSingaporeComponent;
  let fixture: ComponentFixture<SmsSingaporeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ SmsSingaporeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsSingaporeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
