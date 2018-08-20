import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUserComponent } from './tenant-user.component';
import { AppTestModule } from '../../app.module.test';

describe('TenantUserComponent', () => {
  let component: TenantUserComponent;
  let fixture: ComponentFixture<TenantUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ TenantUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
