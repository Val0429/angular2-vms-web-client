import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComponent } from './email.component';
import { AppTestModule } from '../../app.module.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [AppTestModule],
      declarations: [ EmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
