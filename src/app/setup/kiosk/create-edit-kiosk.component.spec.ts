import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditKioskComponent } from './create-edit-kiosk.component';
import { AppTestModule } from '../../app.module.test';

describe('CreateEditKioskComponent', () => {
  let component: CreateEditKioskComponent;
  let fixture: ComponentFixture<CreateEditKioskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [ CreateEditKioskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
