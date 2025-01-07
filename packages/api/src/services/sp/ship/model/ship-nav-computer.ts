
import { newUUID, Quaternion, Vector3 } from '@space-truckers/common'
import { BehaviorSubject } from 'rxjs'
import { injectable } from 'tsyringe'
import { ShipDataContext } from '../data/ship.data-context'

@injectable()
export class ShipNavComputer {
  data = new BehaviorSubject({
    // target: Vector3.negativeOne,
    timeToArrivalDisplay: '',
    path: 'none'
  })

  speed = 50
  toleranceDistance = 1.0 // Stop when close enough
  position: Vector3
  orientation: Quaternion
  destination?: Vector3
  isTraveling = true
  velocity: Vector3 = Vector3.zero
  lastUpdate: number
  distanceRemaining: number = 0
  shu = newUUID()
  flightPlanBuffer: Array<Vector3> = []
  flightPlan: Array<Vector3> = []

  constructor(
    { stats }: ShipDataContext
  ) {
    this.lastUpdate = performance.now()
    this.position = Vector3.createVector3([0, 0, 0])
    this.orientation = Quaternion.createQuaternion([1, 0, 0, 0]) // Starting with the identity quaternion
    this.createFakeFlightplan()
  }
  private createFakeFlightplan() {
    this.setFlightPlan([
      Vector3.createVector3([30, 30, 30]),
      Vector3.createVector3([100, 0, 1000]),
    ])
    this.beginFlightPlan()
  }

  advanceFlightPlan() {
    // try to shift the next coordinate into the computer
    return this.setActiveDestination(this.flightPlanBuffer.shift())
  }

  beginFlightPlan() {
    this.isTraveling = true
    this.advanceFlightPlan()
  }

  setFlightPlan(ar: Array<Vector3>) {
    this.flightPlanBuffer = ar
    this.flightPlan = ar
    this.data.next({
      ...this.data.value,
      path: [this.position, ...ar].map(v => v.toString()).join(' -> ')
    })
  }

  setActiveDestination(coordinate: Vector3 | undefined) {
    this.destination = coordinate
    return this.destination
  }

  update() {

    const currentTime = performance.now()
    const deltaTime = (currentTime - this.lastUpdate) / 1000
    this.lastUpdate = currentTime

    // Simulation loop
    if (this.destination != undefined && this.isTraveling) {
      this.velocity = this.destination.subtract(this.position).normalize().scale(this.speed)
      // Update the ship's position
      this.position = this.position.add(this.velocity.scale(deltaTime))

      this.distanceRemaining = Vector3.distanceBetween(this.position, this.destination)
      // Check if the ship is close enough to the star
      if (this.hasArrivedAtDestination()) {
        this.handleCoordinateArrival()
      }
      // Adjust the orientation to face the star as it moves
      if (this.destination != undefined) {

        const desiredDirection = this.destination.subtract(this.position).normalize()

        // Calculate a quaternion to rotate towards the desired direction
        const currentDirection = this.orientation.rotateVector(Vector3.createVector3([0, 0, 1])) // Assuming initial "forward" direction along z-axis

        // Calculate angle and axis to rotate toward the desired direction
        const dotProduct = currentDirection.x * desiredDirection.x + currentDirection.y * desiredDirection.y + currentDirection.z * desiredDirection.z
        const angle = Math.acos(dotProduct) * (180 / Math.PI)

        if (angle > 0.1) {  // A small threshold to avoid jitter when already aligned
          const rotationAxis = Vector3.createVector3([
            currentDirection.y * desiredDirection.z - currentDirection.z * desiredDirection.y,
            currentDirection.z * desiredDirection.x - currentDirection.x * desiredDirection.z,
            currentDirection.x * desiredDirection.y - currentDirection.y * desiredDirection.x
          ]).normalize()

          const rotationQuaternion = Quaternion.fromAxisAngle(rotationAxis, angle * deltaTime)
          this.orientation = this.orientation.multiply(rotationQuaternion).normalize()
        }

        // const desiredVelocity = desiredDirection.scale(this.speed)
        // this.velocity = this.velocity.lerp(desiredVelocity, deltaTime * 5) // Adjust the "5" multiplier for faster or slower smoothing

        console.log(`update // ${this.shu}`)
        console.log(`flight plan // ${this.data.value.path}`)
        console.log(`Ship Position: (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}, ${this.position.z.toFixed(2)})`)
        console.log(`Ship Destination: (${this.destination.x.toFixed(2)}, ${this.destination.y.toFixed(2)}, ${this.destination.z.toFixed(2)})`)
        console.log(`Orientation: (${this.orientation.w.toFixed(3)}, ${this.orientation.x.toFixed(3)}, ${this.orientation.y.toFixed(3)}, ${this.orientation.z.toFixed(3)})`)
        console.log(`Distance To: (${this.distanceRemaining.toFixed(2)})`)
        console.log(`Velocity: (${this.velocity.magnitude()})`)
        console.log(`${this.flightPlanBuffer.length} jump points remain`)

      }

    }


    this.updateTimeToArrivalDisplay(this.distanceRemaining)
  }

  private hasArrivedAtDestination() {
    return this.distanceRemaining < (this.toleranceDistance + this.velocity.magnitude())
  }

  updateTimeToArrivalDisplay(
    distance: number
  ) {
    // Calculate the estimated time to arrival in seconds
    let estimatedTimeToArrival = distance / this.speed

    // Break down the time into years, days, hours, minutes, and seconds
    const secondsInMinute = 60
    const secondsInHour = 60 * secondsInMinute
    const secondsInDay = 24 * secondsInHour
    const secondsInYear = 365 * secondsInDay // Assuming a non-leap year

    const years = Math.floor(estimatedTimeToArrival / secondsInYear)
    estimatedTimeToArrival %= secondsInYear

    const days = Math.floor(estimatedTimeToArrival / secondsInDay)
    estimatedTimeToArrival %= secondsInDay

    const hours = Math.floor(estimatedTimeToArrival / secondsInHour)
    estimatedTimeToArrival %= secondsInHour

    const minutes = Math.floor(estimatedTimeToArrival / secondsInMinute)
    estimatedTimeToArrival %= secondsInMinute

    const seconds = estimatedTimeToArrival.toFixed(2)
    let message = '...'
    if (this.destination == undefined) {
      message = 'ship has arrived at location'
      this.data.next({
        ...this.data.value,
        timeToArrivalDisplay: message
      })
    }
    else {
      message = `Estimated Time to Arrival: ${years} years, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
      this.data.next({
        ...this.data.value,
        timeToArrivalDisplay: message
      })
      console.log(this.data.value.timeToArrivalDisplay, this.shu)
    }

  }

  handleCoordinateArrival() {
    this.position = this.destination!
    if (this.advanceFlightPlan()) {
      this.isTraveling = true
    } else {
      this.isTraveling = false
      console.log(`Ship has reached destination via route: ${this.data.value.path}`)
      this.createFakeFlightplan()
    }
  }
}
