import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSceneComponent } from './text-scene.component';

describe('TextSceneComponent', () => {
  let component: TextSceneComponent;
  let fixture: ComponentFixture<TextSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextSceneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
