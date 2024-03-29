import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsComponent } from './sms.component';
import { AppTestModule } from '../../app.module.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SmsComponent', () => {
  let component: SmsComponent;
  let fixture: ComponentFixture<SmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [AppTestModule],
      declarations: [ SmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
