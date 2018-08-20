import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTenantUserComponent } from './create-edit-tenant-user.component';
import { AppTestModule } from '../../app.module.test';

describe('CreateEditTenantUserComponent', () => {
  let component: CreateEditTenantUserComponent;
  let fixture: ComponentFixture<CreateEditTenantUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ CreateEditTenantUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditTenantUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
