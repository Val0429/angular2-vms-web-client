import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationComponent } from './investigation.component';
import { AppTestModule } from '../app.module.test';


describe('AttendanceComponent', () => {
  let component: InvestigationComponent;
  let fixture: ComponentFixture<InvestigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
