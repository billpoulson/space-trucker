import { Component, Input, OnInit } from '@angular/core'
import { LoadingState } from '@space-truckers/common'
import { map } from 'rxjs'
import * as THREE from 'three'
import { Mesh } from 'three'
import { RenderContainerComponent } from '../../render-container/render-container.component'
import { SceneContainerComponent } from '../../scene-container/scene-container.component'
import { loadGeometry } from '../../supports/load-geometry'

@Component({
  selector: 'app-model-viewer',
  standalone: false,
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.scss'
})
export class ModelViewerComponent extends SceneContainerComponent implements OnInit {
  xxx!: Mesh
  cameraTarget!: THREE.Vector3
  @Input() modelPath!: string
  cameraDistance: number = 1.3
  constructor(
    renderContainer: RenderContainerComponent
  ) {
    super(renderContainer)
    renderContainer.renderer.shadowMap.enabled = true


  }

  override async ngOnInit(): Promise<void> {

    super.ngOnInit()

    this.camera.position.set(0.2, 0.15, 0.5)
    this.cameraTarget = new THREE.Vector3(0, 0, 0)

    this.scene.background = new THREE.Color(0x073763)
    this.scene.fog = new THREE.Fog(0x0B5394, 2, 15)
    this.createGroundPlane()


    loadGeometry(this.modelPath)
      .pipe(
        map(geometry => {
          const material = new THREE.MeshPhongMaterial({
            color: 0x444444,
            specular: 0x000000,
            shininess: 200
          })
          const mesh = new THREE.Mesh(geometry, material)

          mesh.position.copy(this.cameraTarget)
          mesh.rotation.set(-Math.PI / 2, 0, 0)
          mesh.scale.set(0.005, 0.005, 0.005)

          mesh.castShadow = true
          mesh.receiveShadow = true

          this.scene.add(mesh)
          this.xxx = mesh

          this.createSphereAtPosition(mesh.position)

          this.status$.next(LoadingState.Success)
        })).subscribe()

    this.scene.add(new THREE.HemisphereLight(0x8d7c7c, 0x494966, 3))
    this.addShadowedLight(1, 1, 1, 0xffffff, 3.5)
    this.addShadowedLight(0.5, 1, -1, 0xffd500, 3)
  }

  createSphereAtPosition(position: THREE.Vector3) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      // new THREE.MeshBasicMaterial({ color: 0x00ff00, specular: 0x474747, opacity: 0.1, transparent: true })
      new THREE.MeshPhongMaterial({
        color: 0x351C75,
        specular: 0x3D85C6,
        emissiveIntensity: 0.7,
        dithering: true,
        opacity: .08,
        transparent: true
      })

    )

    mesh.position.set(position.x, position.y, position.z) // Offset by 1 on the z-axis

    this.scene.add(mesh)
  }

  private createGroundPlane() {
    const sp = 3
    const sz = 400

    // const mesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(100, 32, 32),
    //   // new THREE.MeshBasicMaterial({ color: 0x00ff00, specular: 0x474747, opacity: 0.1, transparent: true })
    //   new THREE.MeshPhongMaterial({
    //     color: 0x674EA7,
    //     specular: 0x474747,
    //     opacity: .01,
    //     // transparent: true,
    //     side: THREE.DoubleSide
    //   })
    //   // new THREE.TextureLoader({
    //   //   color: 0x674EA7,
    //   //   specular: 0x474747,
    //   //   opacity: .01,
    //   //   transparent: true,
    //   //   side: THREE.DoubleSide
    //   // })

    // )
    // mesh.position.set(position.x, position.y, position.z) // Offset by 1 on the z-axis
    // this.scene.add(mesh)

    // let plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(sz, sz),
    //   new THREE.MeshPhongMaterial({
    //     color: 0x351C75,
    //     specular: 0x474747,
    //     opacity: .7,
    //     transparent: true,
    //     side: THREE.DoubleSide
    //   })
    // )
    // plane.rotation.x = -Math.PI / 2
    // plane.position.y = sp * -1
    // this.scene.add(plane)

    // plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(sz, sz),
    //   new THREE.MeshPhongMaterial({
    //     color: 0x674EA7,
    //     specular: 0x474747,
    //     opacity: .2,
    //     transparent: true,
    //     side: THREE.DoubleSide
    //   })
    // )
    // plane.rotation.x = -Math.PI / 2
    // plane.position.y = sp
    // this.scene.add(plane)


    // let plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(1000, 1000),
    //   new THREE.MeshPhongMaterial({
    //     color: 0x00000,
    //     specular: 0x474747,
    //     opacity: .001,
    //     side: THREE.DoubleSide
    //   })
    // )
    // plane.rotation.x = -Math.PI / 2
    // plane.position.y = -1
    // plane.rotateX(Math.PI * 2)
    // this.scene.add(plane)
    // plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(1000, 1000),
    //   new THREE.MeshPhongMaterial({
    //     // color: 0x351C75,
    //     color: 0x00ff00,
    //     specular: 0x474747,
    //     opacity: .001,
    //     side: THREE.DoubleSide
    //   })
    // )
    // plane.rotation.x = Math.PI / 2
    // plane.position.y = 50
    // this.scene.add(plane)
  }

  addShadowedLight(x: number, y: number, z: number, color: number, intensity: number): void {
    const directionalLight = new THREE.DirectionalLight(color, intensity)
    directionalLight.position.set(x, y, z)
    this.scene.add(directionalLight)

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

  override update(): void {
    const timer = Date.now() * 0.0001

    this.camera.position.x = Math.cos(timer) * this.cameraDistance
    this.camera.position.z = Math.sin(timer) * this.cameraDistance
    this.camera.position.y = Math.sin(timer) * this.cameraDistance
    this.camera.lookAt(this.cameraTarget)
  }
}
