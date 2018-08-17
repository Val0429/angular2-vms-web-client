import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditFloorComponent } from './create-edit-floor.component';
import { AppTestModule } from '../../app.module.test';

describe('CreateEditFloorComponent', () => {
  let component: CreateEditFloorComponent;
  let fixture: ComponentFixture<CreateEditFloorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
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
