import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AgGridAngular } from 'ag-grid-angular'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { SharedUIComponentsModule } from '../shared/shared.ui.module'
import { SphereAssetComponent } from './asset/sphere-asset/sphere-asset.component'
import { RenderContainerComponent } from './render-container/render-container.component'
import { SceneContainerComponent } from './scene-container/scene-container.component'
import { ExampleComponent } from './scenes/example/example.component'
import { ModelViewerComponent } from './scenes/model-viewer/model-viewer.component'
import { TextSceneComponent } from './scenes/text-scene/text-scene.component'

const sharedComponents = [
  RenderContainerComponent,
  SceneContainerComponent,
  ExampleComponent,
  TextSceneComponent,
  ModelViewerComponent,
  SphereAssetComponent
]

@NgModule({
  imports: [
    CommonModule,
    AgGridAngular,
    MaterialUIModule,
    RouterModule,
    SharedUIComponentsModule
  ],
  declarations: sharedComponents,
  exports: [...sharedComponents]
})
export class RendererComponentsModule { }

