/* tslint:disable:no-unused-variable */
import { AppComponent } from './app.component';
import { TestBed } from '@angular/core/testing';

import { Http } from '@angular/http';
import { By }             from '@angular/platform-browser';
import { AppTestModule } from './app.module.test';


////////  SPECS  /////////////

/// Delete this
describe('Smoke test', () => {
  it('should run a passing test', () => {
    expect(true).toEqual(true, 'should pass');
  });
});

describe('AppComponent with TCB', function () {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [AppComponent]
    });
  });

  it('should instantiate component', () => {
    let fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
  });

});
