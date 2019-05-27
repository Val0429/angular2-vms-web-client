import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCardComponent } from './visitor-card.component';
import { AppTestModule } from '../../app.module.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('VisitorCardComponent', () => {
  let component: VisitorCardComponent;
  let fixture: ComponentFixture<VisitorCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [AppTestModule],
      declarations: [ VisitorCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
