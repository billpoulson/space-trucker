import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { LoadingState } from '@space-truckers/common'
import { distinctUntilChanged } from 'rxjs'
import { RenderContainerComponent } from '../../render-container/render-container.component'
import { ModelViewerComponent } from '../../scenes/model-viewer/model-viewer.component'
import { TextSceneComponent } from '../../scenes/text-scene/text-scene.component'

@Component({
  selector: 'app-example-gameroot',
  standalone: false,

  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent implements OnInit, AfterViewInit {

  @ViewChild(ModelViewerComponent) modelViewer!: ModelViewerComponent
  @ViewChild(TextSceneComponent) loadingScene!: TextSceneComponent
  @ViewChild(RenderContainerComponent) renderContainer!: RenderContainerComponent

  constructor() {
  }

  ngAfterViewInit(): void {
    this.modelViewer.status$
      .pipe(distinctUntilChanged())
      .subscribe(v => {
        if (v === LoadingState.Loading)
          this.renderContainer.activeSceneInstance.next(this.loadingScene)
        if (v === LoadingState.Success)
          this.renderContainer.activeSceneInstance.next(this.modelViewer)
      })
  }

  ngOnInit(): void {
  }
}
