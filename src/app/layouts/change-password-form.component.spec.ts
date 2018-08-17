import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordFormComponent } from './change-password-form.component';
import { AppTestModule } from '../app.module.test';

describe('ChangePasswordFormComponent', () => {
  let component: ChangePasswordFormComponent;
  let fixture: ComponentFixture<ChangePasswordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ ChangePasswordFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
