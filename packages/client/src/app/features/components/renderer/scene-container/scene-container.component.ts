import { Component, Input, OnInit } from '@angular/core'
import { LoadingState, newUUID } from '@space-truckers/common'
import { BehaviorSubject } from 'rxjs'
import * as THREE from 'three'
import { Scene } from 'three'
import { RenderContainerComponent } from '../render-container/render-container.component'

@Component({
  selector: 'app-scene-container',
  standalone: false,
  templateUrl: './scene-container.component.html',
  styleUrls: ['./scene-container.component.scss']
})
export class SceneContainerComponent implements OnInit {
  scene!: Scene
  camera!: THREE.PerspectiveCamera

  @Input() public sceneName = newUUID()

  public status$ = new BehaviorSubject<LoadingState>(LoadingState.Idle)

  constructor(
    private renderContainer: RenderContainerComponent
  ) {
    this.status$.next(LoadingState.Loading)
    renderContainer.registerScene(this)

  }

  ngOnInit(): void {
    const { opts } = this.renderContainer

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, opts.w / opts.h, 0.01, 1000000)
    this.camera.updateProjectionMatrix()
  }
  update(): void { }
}
