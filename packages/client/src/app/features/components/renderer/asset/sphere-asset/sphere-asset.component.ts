import { Component, Input, OnInit } from '@angular/core'
import { Vector3 } from '@space-truckers/common'
import * as THREE from 'three'
import { SceneContainerComponent } from '../../scene-container/scene-container.component'
import { convertToThreeVector } from '../../supports/convert-to-three-vector'
@Component({
  selector: 'app-sphere-asset',
  standalone: false,

  templateUrl: './sphere-asset.component.html',
  styleUrl: './sphere-asset.component.scss'
})
export class SphereAssetComponent implements OnInit {
  scene!: THREE.Scene
  @Input() scene2!: SceneContainerComponent
  constructor(

  ) {
  }
  ngOnInit(): void {
    const j = this.scene2
    this.scene=this.scene2.scene
    this.createSphereAtPosition(convertToThreeVector(Vector3.zero))
  }

  createSphereAtPosition(position: THREE.Vector3) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      // new THREE.MeshBasicMaterial({ color: 0x00ff00, specular: 0x474747, opacity: 0.1, transparent: true })
      new THREE.MeshPhongMaterial({
        color: 0xFF000,
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
}
