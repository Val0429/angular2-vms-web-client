import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrsComponent } from './frs.component';

describe('FrsComponent', () => {
  let component: FrsComponent;
  let fixture: ComponentFixture<FrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
