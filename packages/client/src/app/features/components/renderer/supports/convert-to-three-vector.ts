import { Vector3 } from '@space-truckers/common'
import * as THREE from 'three'


export const convertToThreeVector = (v: Vector3): THREE.Vector3 => new THREE.Vector3(v.x, v.y, v.z)
