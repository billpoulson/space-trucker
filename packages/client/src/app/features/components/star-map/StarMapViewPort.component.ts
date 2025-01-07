import { Component, HostListener, OnInit } from '@angular/core'
import { getRandomInclusive, newGUID, Vector3, Vector3Boundary } from '@space-truckers/common'
import { Dictionary } from '@space-truckers/types'
import THREE, { Camera, Mesh, Scene } from 'three'
@Component({
  selector: 'app-StarMapViewPort',
  templateUrl: './StarMapViewPort.component.html',
  styleUrls: ['./StarMapViewPort.component.scss']
})
export class StarMapViewPortComponent implements OnInit {
  scene: Scene = new THREE.Scene()
  camera: Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000)
  // THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000)
  renderer = new THREE.WebGLRenderer()
  cubeSize = 10000

  flyToVector3 = Vector3.zero
  autopilotToggle = false
  rotate = 0
  // geometry = new THREE.BoxGeometry()
  // geometry = new THREE.SphereGeometry(1, 32, 32)
  // material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  // cube = new THREE.Mesh(this.geometry, this.material)

  loadedMesh: Dictionary<Mesh> = {}
  activeOpCode = 0
  constructor() { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event)

    if (event.key === 'Enter') {
      this.goToNextRandomLocation()
    }
    if (event.key === 'a') {
      this.autopilotToggle = !this.autopilotToggle
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.rotate = 0
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent2(event: KeyboardEvent) {
    console.log(event)

    this.rotate = this.getRotate(event.key)
  }
  getRotate(key: string) {
    switch (key) {
      case 'ArrowLeft': return 1
      case 'ArrowRight': return -1
      default: return 0
    }
  }
  ngOnInit() {

    this.camera.position.x = this.cubeSize / 2
    this.camera.position.y = this.cubeSize / 2
    this.camera.position.z = this.cubeSize / 2

    this.seed()
    this.flyToVector3 = this.pickRandomPoint()
    this.camera.lookAt(convertToThreeVector(this.flyToVector3))
    // this.camera.
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.getDrawingBufferSize(new THREE.Vector2())
    document.body.appendChild(this.renderer.domElement)
    this.animate()

  }

  private goToNextRandomLocation() {
    this.flyToVector3 = this.pickRandomPoint()
    this.camera.lookAt(convertToThreeVector(this.flyToVector3))
  }

  private animate = () => {
    requestAnimationFrame(this.animate)
    const targetVector = convertToThreeVector(this.flyToVector3)
    const distanceToTarget = this.camera.position.distanceTo(targetVector)
    const shipSpeed = resolveSpeed(distanceToTarget)
    this.camera.translateOnAxis(new THREE.Vector3(0, 0, -1), shipSpeed)

    if (shipSpeed === 0) {
      this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.rotate * 0.01)
      if (this.autopilotToggle) {
        this.goToNextRandomLocation()
      }
    }

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
    return nextMesh.position
  }
}

export const convertToThreeVector = (v: Vector3): THREE.Vector3 => new THREE.Vector3(v.x, v.y, v.z)
export const resolveSpeed = (distanceToTarget: number): number => {
  let r = 200
  if (distanceToTarget <= 1000) {
    r = 8
  }
  if (distanceToTarget <= 500) {
    r = 4
  }
  if (distanceToTarget <= 100) {
    r = 2
  }
  if (distanceToTarget <= 50) {
    r = 1
  }
  if (distanceToTarget <= 10) {
    r = 0
  }
  return r
}

