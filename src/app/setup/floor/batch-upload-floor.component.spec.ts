import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchUploadFloorComponent } from './batch-upload-floor.component';

describe('BatchUploadFloorComponent', () => {
  let component: BatchUploadFloorComponent;
  let fixture: ComponentFixture<BatchUploadFloorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchUploadFloorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchUploadFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
