import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditUserComponent } from './create-edit-user.component';
import { AppTestModule } from '../../app.module.test';

describe('CreateEditUserComponent', () => {
  let component: CreateEditUserComponent;
  let fixture: ComponentFixture<CreateEditUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ CreateEditUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
