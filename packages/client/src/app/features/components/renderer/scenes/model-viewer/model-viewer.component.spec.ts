import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelViewerComponent } from './model-viewer.component';

describe('ModelViewerComponent', () => {
  let component: ModelViewerComponent;
  let fixture: ComponentFixture<ModelViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
