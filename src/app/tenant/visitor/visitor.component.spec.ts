import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorComponent } from './visitor.component';
import { AppTestModule } from 'app/app.module.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('VisitorComponent', () => {
  let component: VisitorComponent;
  let fixture: ComponentFixture<VisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],  
      imports: [AppTestModule],
      declarations: [ VisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
