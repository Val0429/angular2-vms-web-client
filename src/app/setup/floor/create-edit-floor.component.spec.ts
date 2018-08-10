import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditFloorComponent } from './create-edit-floor.component';

describe('CreateEditFloorComponent', () => {
  let component: CreateEditFloorComponent;
  let fixture: ComponentFixture<CreateEditFloorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditFloorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
