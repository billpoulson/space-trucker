/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RenderContainerComponent } from './render-container.component'


describe('StarMapViewPortComponent', () => {
  let component: RenderContainerComponent
  let fixture: ComponentFixture<RenderContainerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenderContainerComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
