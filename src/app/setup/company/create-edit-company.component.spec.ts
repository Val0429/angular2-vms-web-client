import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCompanyComponent } from './create-edit-company.component';

describe('CreateEditCompanyComponent', () => {
  let component: CreateEditCompanyComponent;
  let fixture: ComponentFixture<CreateEditCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
