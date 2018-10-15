import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorPopupComponent } from './visitor-popup.component';
import { AppTestModule } from '../app.module.test';

describe('VisitorComponent', () => {
  let component: VisitorPopupComponent;
  let fixture: ComponentFixture<VisitorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ VisitorPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
