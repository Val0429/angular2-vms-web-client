import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditEmployeeComponent } from './create-edit-employee.component';

describe('CreateEditEmployeeComponent', () => {
  let component: CreateEditEmployeeComponent;
  let fixture: ComponentFixture<CreateEditEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
