import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { getRandomInclusive, newGUID, Vector3, Vector3Boundary } from '@space-truckers/common'
import { Dictionary } from '@space-truckers/types'
import { BehaviorSubject } from 'rxjs'
import * as THREE from 'three'
import { Mesh, Scene } from 'three'

type RenderTargetSizeChangeEvent = { h: number, w: number, aspect: number }
class RenderTargetSize {
  change$: BehaviorSubject<RenderTargetSizeChangeEvent>
  constructor(
    public h: number,
    public w: number
  ) {
    this.change$ = new BehaviorSubject<RenderTargetSizeChangeEvent>(this.getEvent())
  }
  private getEvent(): RenderTargetSizeChangeEvent {
    return {
      h: this.h,
      w: this.w,
      aspect: this.aspect()
    }
  }

  update(h: number, w: number) {
    this.h = h
    this.w = w
    this.change$.next(this.getEvent())
  }
  aspect() { return this.h / this.w }
}

@Component({
  selector: 'app-star-map',
  templateUrl: './StarMapViewPort.component.html',
  styleUrls: ['./StarMapViewPort.component.scss'],
  standalone: false
})
export class StarMapViewPortComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef
  scene: Scene = new THREE.Scene()
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  cubeSize = 10000

  flyToVector3 = Vector3.zero
  autopilotToggle = false
  rotate = 0

  opts = new RenderTargetSize(0, 0)
  loadedMesh: Dictionary<Mesh> = {}
  activeOpCode = 0
  constructor() {
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.camera = new THREE.PerspectiveCamera(75, this.opts.w / this.opts.h, 0.1, 1000000)
  }

  ngOnInit() {
    this.setCameraToCenter()

    this.opts.change$
      .subscribe(v => {
        this.renderer.setSize(this.opts.w, this.opts.h)
        this.renderer.getDrawingBufferSize(new THREE.Vector2())
      })

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)

    this.animate()

  }

  private setCameraToCenter() {
    this.camera.position.x = this.cubeSize / 2
    this.camera.position.y = this.cubeSize / 2
    this.camera.position.z = this.cubeSize / 2
  }


  private animate = () => {
    requestAnimationFrame(this.animate)


    this.renderer.render(this.scene, this.camera)
  }

  private seed = () => {
    const objectCount = this.cubeSize * 2
    const boundary = new Vector3Boundary(Vector3.zero, Vector3.multiplyBy(Vector3.one, this.cubeSize * 10))

    for (let i = 0; i < objectCount; i++) {
      const nextId = newGUID()

      const geometry = new THREE.SphereGeometry(100, 8, 8)
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const mesh = new THREE.Mesh(geometry, material)
      const nextPosition = Vector3.random(boundary)

      mesh.position.set(nextPosition.x, nextPosition.y, nextPosition.z)

      this.loadedMesh[nextId] = mesh
      this.scene.add(this.loadedMesh[nextId])
    }
  }

  private pickRandomPoint() {
    const key = Object.keys(this.loadedMesh)
    const randomIndex = getRandomInclusive(0, key.length)
    const nextMesh = this.loadedMesh[key[randomIndex]]
    return Vector3.createVector3(nextMesh.position.toArray())
  }
}


