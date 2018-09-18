import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskComponent } from './kiosk.component';
import { AppTestModule } from '../../app.module.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('KioskComponent', () => {
  let component: KioskComponent;
  let fixture: ComponentFixture<KioskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],      
      imports: [AppTestModule],
      declarations: [ KioskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
