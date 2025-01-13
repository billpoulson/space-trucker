import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { Dictionary } from '@space-truckers/types'
import { BehaviorSubject } from 'rxjs'
import * as THREE from 'three'
import { Mesh } from 'three'
import { SceneContainerComponent } from '../scene-container/scene-container.component'
import { RenderTargetSize } from '../supports/render-target-size'

@Component({
  selector: 'app-renderer',
  templateUrl: './render-container.component.html',
  styleUrls: ['./render-container.component.scss'],
  standalone: false
})
export class RenderContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef
  scenes: SceneContainerComponent[] = []
  renderer: THREE.WebGLRenderer
  activeSceneInstance = new BehaviorSubject<SceneContainerComponent | null>(null)
  loadedMesh: Dictionary<Mesh> = {}
  activeSceneId = 'default'
  @Input() h: number = -1
  @Input() w: number = -1
  opts!: RenderTargetSize
  constructor(
  ) {
    this.renderer = new THREE.WebGLRenderer()
  }

  ngOnInit(): void {
    this.opts = new RenderTargetSize(this.h, this.w)

  }
  getActiveSceneInstance() {
    return this.scenes.find(x => x.sceneName == this.activeSceneId)!
  }

  ngAfterViewInit() {
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)
    const { w, h } = this.opts
    this.renderer.setSize(w, h)
    this.renderer.setPixelRatio(this.opts.aspect())
    // this.activeSceneInstance.next(this.getActiveSceneInstance())
    this.animate()
  }
  registerScene(scene: SceneContainerComponent) {
    this.scenes.push(scene)
  }

  private animate = () => {
    requestAnimationFrame(this.animate)
    const instance = this.activeSceneInstance.value!
    if (instance) {
      const { camera, scene } = instance
      instance.update()
      if (scene) {
        // const scene = this.activeSceneInstance.value!
        // if(instance.loaded){
        this.renderer.render(scene, camera)
        // }
      }
    }
  }
}

