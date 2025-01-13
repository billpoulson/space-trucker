import { Component, Input } from '@angular/core'
import { LoadingState } from '@space-truckers/common'
import * as THREE from 'three'
import { RenderContainerComponent } from '../../render-container/render-container.component'
import { SceneContainerComponent } from '../../scene-container/scene-container.component'
import { FontLoader } from '../../supports/font-loader'
import { TextGeometry } from '../../supports/text-geometry'

@Component({
  selector: 'app-text-scene',
  standalone: false,

  templateUrl: './text-scene.component.html',
  styleUrl: './text-scene.component.scss'
})
export class TextSceneComponent extends SceneContainerComponent {
  textMesh!: THREE.Mesh
  textMaterial!: THREE.MeshBasicMaterial
  @Input() text = ''
  constructor(
    renderContainer: RenderContainerComponent
  ) {
    super(renderContainer)
  }

  override ngOnInit(): void {
    const loader = new FontLoader()
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry(this.text, {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false
      })

      textGeometry.computeBoundingBox()
      const boundingBox = textGeometry.boundingBox!
      const offsetX = (boundingBox.max.x - boundingBox.min.x) / 2
      const offsetY = (boundingBox.max.y - boundingBox.min.y) / 2
      const offsetZ = (boundingBox.max.z - boundingBox.min.z) / 2
      textGeometry.translate(-offsetX, -offsetY, -offsetZ)

      this.textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
      this.textMesh = new THREE.Mesh(textGeometry, this.textMaterial)

      this.scene.add(this.textMesh)

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshPhongMaterial({ color: 0x351C75, specular: 0x474747, opacity: .7 })
      )
      plane.rotation.x = -Math.PI / 2
      plane.position.y = -0.5
      this.scene.add(plane)

      this.positionCamera()
      this.animateTextColor()

      this.status$.next(LoadingState.Success)
    })
  }

  positionCamera(): void {
    this.camera.position.set(0, 0, 1000)
    this.camera.lookAt(0, 0, 0)
  }
  animateTextColor(): void {
    let hue = 0
    const changeColor = () => {
      hue = (hue + 1) % 360
      const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`)
      this.textMaterial.color.set(color)
      requestAnimationFrame(changeColor)
    }
    changeColor()
  }
}
