import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditKioskComponent } from './create-edit-kiosk.component';

describe('CreateEditKioskComponent', () => {
  let component: CreateEditKioskComponent;
  let fixture: ComponentFixture<CreateEditKioskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
