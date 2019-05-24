import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTabletComponent } from './create-edit-tablet.component';

describe('CreateEditTabletComponent', () => {
  let component: CreateEditTabletComponent;
  let fixture: ComponentFixture<CreateEditTabletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditTabletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
