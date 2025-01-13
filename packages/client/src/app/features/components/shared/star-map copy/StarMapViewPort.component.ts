import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { getRandomInclusive, newGUID, Vector3, Vector3Boundary } from '@space-truckers/common'
import { Dictionary } from '@space-truckers/types'
import * as THREE from 'three'
import { Mesh, Scene } from 'three'
import { STLLoader } from '../../renderer/supports/stl-loader'

@Component({
  selector: 'app-star-mapx',
  templateUrl: './StarMapViewPort.component.html',
  styleUrls: ['./StarMapViewPort.component.scss'],
  standalone: false
})
export class StarMapViewPortComponentd implements OnInit {
  sz = [700, 500, window.innerWidth, window.innerHeight];
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef
  scene: Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera
  renderer = new THREE.WebGLRenderer();
  cubeSize = 10000;

  flyToVector3 = Vector3.zero;
  autopilotToggle = false;
  rotate = 0;
  loadedMesh: Dictionary<Mesh> = {};
  activeOpCode = 0;
  model!: THREE.Mesh<any, THREE.MeshPhongMaterial, THREE.Object3DEventMap>
  pointLight!: THREE.PointLight

  constructor() {
    const [, , w, h] = this.sz
    this.camera = new THREE.PerspectiveCamera(
      75,
      w / h,
      0.1,
      1000000
    )
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
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
    this.rotate = this.getRotate(event.key)
  }

  getRotate(key: string) {
    switch (key) {
      case 'ArrowLeft': return 1
      case 'ArrowRight': return -1
      default: return 0
    }
  }

  async ngOnInit() {
    // await this.loadSTLModel()
    // this.seed()
    // this.flyToVector3 = Vector3.createVector3(this.pickRandomPoint().toArray())
    const [w, h] = this.sz
    // this.camera.aspect = w / h

    // this.renderer.setSize(w, h)
    // this.renderer.getDrawingBufferSize(new THREE.Vector2())
    // this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)

    // const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    // this.scene.add(ambientLight)
    // this.scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01, THREE.SRGBColorSpace)
    // this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000)
    // this.pointLight = new THREE.PointLight(0xffffff, 1, 1000)
    // this.pointLight.position.set(50, 50, 50)
    // this.scene.add(this.pointLight)
    // this.animate()


    function s(container) {
      let objPost = Vector3.zero


      let camera: THREE.PerspectiveCamera
      let cameraTarget: THREE.Vector3
      let scene: THREE.Scene
      let renderer: THREE.WebGLRenderer
      let xxx: Mesh

      init()

      function init(): void {

        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15)
        camera.position.set(1, 0.15, 1)

        cameraTarget = new THREE.Vector3(0, -0.25, 0)

        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x073763)
        scene.fog = new THREE.Fog(0x0B5394, 2, 15)

        // Ground
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(40, 40),
          new THREE.MeshPhongMaterial({ color: 0x351C75, specular: 0x474747, opacity: .7 })
        )
        plane.rotation.x = -Math.PI / 2
        plane.position.y = -0.5
        scene.add(plane)

        // plane.receiveShadow = true

        // ASCII file
        const loader = new STLLoader()
        loader.load('/Tornado_Escort_Carrier.stl',
          (geometry) => {
            const material = new THREE.MeshPhongMaterial({ color: 0x444444, specular: 0x134F5C, shininess: 200 })
            const mesh = new THREE.Mesh(geometry, material)

            mesh.position.copy(cameraTarget)
            // mesh.position.set(0, -0.25, 0.6)
            mesh.rotation.set(-Math.PI / 2, 0, 0)
            mesh.scale.set(0.005, 0.005, 0.005)

            mesh.castShadow = true
            mesh.receiveShadow = true

            scene.add(mesh)
            xxx = mesh
          },
          (progress) => {
            const ss = `${(progress.loaded / progress.total) * 100}%`
            console.log(`Loading: ${ss}`)

          },
          (error) => {
            console.error('An error occurred while loading the STL file:', error)
          }
        )

        // Lights
        scene.add(new THREE.HemisphereLight(0x8d7c7c, 0x494966, 3))

        addShadowedLight(1, 1, 1, 0xffffff, 3.5)
        addShadowedLight(0.5, 1, -1, 0xffd500, 3)

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(w / h)
        renderer.setSize(w, h)
        renderer.setAnimationLoop(animate)

        renderer.shadowMap.enabled = true

        container.appendChild(renderer.domElement)

        // Stats
        // stats = new Stats()
        // container.appendChild(stats.dom)

        // Event listeners
        window.addEventListener('resize', onWindowResize)
      }

      function addShadowedLight(x: number, y: number, z: number, color: number, intensity: number): void {
        const directionalLight = new THREE.DirectionalLight(color, intensity)
        directionalLight.position.set(x, y, z)
        scene.add(directionalLight)

        directionalLight.castShadow = true

        const d = 1
        directionalLight.shadow.camera.left = -d
        directionalLight.shadow.camera.right = d
        directionalLight.shadow.camera.top = d
        directionalLight.shadow.camera.bottom = -d

        directionalLight.shadow.camera.near = 1
        directionalLight.shadow.camera.far = 4

        directionalLight.shadow.bias = -0.002
      }

      function onWindowResize(): void {
        camera.aspect = w / h
        camera.updateProjectionMatrix()

        renderer.setSize(w, h)
      }

      function animate(): void {
        render()
        // stats.update()
      }

      function render(): void {
        const timer = Date.now() * 0.0005

        // camera.position.x = Math.cos(timer) * 3
        // camera.position.z = Math.sin(timer) * 3
        const shipSpeed = 0.002
        const targetVector = convertToThreeVector(Vector3.createVector3([0, 10, 0]))
        if (xxx != null) {
          const moveDirection = new THREE.Vector3().subVectors(targetVector, xxx.position).normalize()
          xxx.translateOnAxis(moveDirection, shipSpeed)
        }
        camera.lookAt(cameraTarget)

        renderer.render(scene, camera)
      }

    }
    s(this.rendererContainer.nativeElement)

  }



  private goToNextRandomLocation() {
    this.flyToVector3 = Vector3.createVector3(this.pickRandomPoint().toArray())
  }

  private animate = () => {
    requestAnimationFrame(this.animate)

    const targetVector = convertToThreeVector(this.flyToVector3)
    const distanceToTarget = this.model.position.distanceTo(targetVector)
    const shipSpeed = resolveSpeed(distanceToTarget)
    const moveDirection = new THREE.Vector3().subVectors(targetVector, this.model.position).normalize()
    this.model.translateOnAxis(moveDirection, shipSpeed)

    this.model.lookAt(targetVector)
    this.model.rotation.set(0, 0, -Math.PI / 2)

    this.camera.position.copy(this.model.position).add(new THREE.Vector3(0, 50, -300))
    this.pointLight.position.copy(this.camera.position)
      .add(new THREE.Vector3(0, 50, -300))
    this.pointLight.lookAt(this.model.position)
    this.camera.lookAt(this.model.position)

    if (shipSpeed === 0) {
      this.model.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.rotate * 0.01)
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
