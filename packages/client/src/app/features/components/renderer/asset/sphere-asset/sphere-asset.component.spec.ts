import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SphereAssetComponent } from './sphere-asset.component';

describe('SphereAssetComponent', () => {
  let component: SphereAssetComponent;
  let fixture: ComponentFixture<SphereAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SphereAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SphereAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
