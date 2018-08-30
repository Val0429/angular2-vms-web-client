import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorStatisticComponent } from './visitor-statistic.component';
import { AppTestModule } from '../app.module.test';


describe('VisitorStatisticComponent', () => {
  let component: VisitorStatisticComponent;
  let fixture: ComponentFixture<VisitorStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [VisitorStatisticComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
