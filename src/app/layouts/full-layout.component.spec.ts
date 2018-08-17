import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullLayoutComponent } from './full-layout.component';
import { AppTestModule } from '../app.module.test';
import { BreadcrumbsComponent } from '../shared/breadcrumb.component';

describe('FullLayoutComponent', () => {
  let component: FullLayoutComponent;
  let fixture: ComponentFixture<FullLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [FullLayoutComponent, BreadcrumbsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
