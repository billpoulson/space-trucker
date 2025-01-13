/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StarMapViewPortComponent } from './StarMapViewPort.component';

describe('StarMapViewPortComponent', () => {
  let component: StarMapViewPortComponent;
  let fixture: ComponentFixture<StarMapViewPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarMapViewPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarMapViewPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
