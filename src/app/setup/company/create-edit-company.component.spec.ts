import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCompanyComponent } from './create-edit-company.component';
import { AppTestModule } from '../../app.module.test';

describe('CreateEditCompanyComponent', () => {
  let component: CreateEditCompanyComponent;
  let fixture: ComponentFixture<CreateEditCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[AppTestModule],
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
