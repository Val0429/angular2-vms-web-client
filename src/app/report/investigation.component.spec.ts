import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationComponent } from './investigation.component';
import { AppTestModule } from '../app.module.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('InvestigationComponent', () => {
  let component: InvestigationComponent;
  let fixture: ComponentFixture<InvestigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AppTestModule],
      declarations: [InvestigationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
