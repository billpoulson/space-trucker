import { Quaternion, Vector3 } from '@space-truckers/common'
import { SimulationTime } from '../../../gamify/time/simulation-time'


export class ShipPhysicsState {

  constructor(
    private t: SimulationTime,
    public speed = 0.00001,
    public position: Vector3 = Vector3.one,
    public orientation: Quaternion = Quaternion.zero,
    public velocity: Vector3 = Vector3.zero
  ) { }

  updatePosition(destination: Vector3) {
    this.velocity = destination.subtract(this.position).normalize().scale(this.speed)
    // Update the ship's position
    this.position = this.position.add(this.velocity.scale(this.t.timeDelta.getValue()))
  }

  updateRotation(destination: Vector3) {

    const desiredDirection = destination.subtract(this.position).normalize()

    // Calculate a quaternion to rotate towards the desired direction
    const currentDirection = this.orientation.rotateVector(Vector3.createVector3([0, 0, 1])) // Assuming initial "forward" direction along z-axis


    // Calculate angle and axis to rotate toward the desired direction
    const dotProduct = currentDirection.x * desiredDirection.x + currentDirection.y * desiredDirection.y + currentDirection.z * desiredDirection.z
    const angle = Math.acos(dotProduct) * (180 / Math.PI)

    if (angle > 0.1) { // A small threshold to avoid jitter when already aligned
      const rotationAxis = Vector3.createVector3([
        currentDirection.y * desiredDirection.z - currentDirection.z * desiredDirection.y,
        currentDirection.z * desiredDirection.x - currentDirection.x * desiredDirection.z,
        currentDirection.x * desiredDirection.y - currentDirection.y * desiredDirection.x
      ]).normalize()

      const rotationQuaternion = Quaternion.fromAxisAngle(rotationAxis, angle * this.t.timeDelta.getValue())
      this.orientation = this.orientation.multiply(rotationQuaternion).normalize()
    }
  }

  eta(distance: number) {
    return distance / this.speed
  }

  toString() {
    return [
      `Ship Position: (${this.position.x.toFixed(5)}, ${this.position.y.toFixed(5)}, ${this.position.z.toFixed(5)})`,
      `Orientation: (${this.orientation.w.toFixed(3)}, ${this.orientation.x.toFixed(3)}, ${this.orientation.y.toFixed(3)}, ${this.orientation.z.toFixed(3)})`,
      `Velocity: (${this.velocity.magnitude()})`
    ].join('\r')
  }

}
