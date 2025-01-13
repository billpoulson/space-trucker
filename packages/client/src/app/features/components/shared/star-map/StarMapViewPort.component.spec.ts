/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { StarMapViewPortComponent } from './StarMapViewPort.component'

describe('StarMapViewPortComponent', () => {
  let component: StarMapViewPortComponent
  let fixture: ComponentFixture<StarMapViewPortComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StarMapViewPortComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StarMapViewPortComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
