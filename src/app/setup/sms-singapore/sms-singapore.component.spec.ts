import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSingaporeComponent } from './sms-singapore.component';
import { AppTestModule } from '../../app.module.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SmsSingaporeComponent', () => {
  let component: SmsSingaporeComponent;
  let fixture: ComponentFixture<SmsSingaporeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
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
