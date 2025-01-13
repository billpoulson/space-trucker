
import { newUUID, Vector3 } from '@space-truckers/common'
import { BehaviorSubject } from 'rxjs'
import { injectable } from 'tsyringe'
import { SimulationTime } from '../../../gamify/time/simulation-time'
import { ShipDataContext } from '../data/ship.data-context'
import { ShipPhysicsState } from './ship-physics-state'

@injectable()
export class ShipNavComputer {
  deliveryCt = 0;
  uuid = newUUID()
  data = new BehaviorSubject({
    timeToArrivalDisplay: '',
    path: 'none'
  })

  flightPlanActive = true
  toleranceDistance = 1.0 // Stop when close enough

  physicsState: ShipPhysicsState
  destination?: Vector3

  distanceRemaining: number = 0

  flightPlanBuffer: Array<Vector3> = []
  flightPlan: Array<Vector3> = []

  constructor(
    { stats }: ShipDataContext,
    private timeStep: SimulationTime
  ) {
    this.physicsState = new ShipPhysicsState(timeStep)
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
    this.flightPlanActive = true
    this.advanceFlightPlan()
  }

  setFlightPlan(ar: Array<Vector3>) {
    this.flightPlanBuffer = ar
    this.flightPlan = ar
    this.data.next({
      ...this.data.value,
      path: [this.physicsState.position, ...ar].map(v => v.toString()).join(' -> ')
    })
  }

  setActiveDestination(coordinate: Vector3 | undefined) {
    this.destination = coordinate
    return this.destination
  }

  update() {
    this.timeStep.Update()

    // Simulation loop
    if (this.isUnderway()) {
      this.physicsState.updatePosition(this.destination!)
      this.distanceRemaining = Vector3.distanceBetween(this.physicsState.position, this.destination!)

      // Check if the ship is close enough to the star
      if (this.hasArrivedAtDestination()) {
        this.handleCoordinateArrival()
      }
      else {
        // Adjust the orientation to face the star as it moves
        if (this.hasDestination()) {
          this.physicsState.updateRotation(this.destination!)
        }

        // console.log(`update // ${this.uuid} | total-deliveries // ${this.deliveryCt}`)
        // console.log(`flight plan // ${this.data.value.path}`)
        // console.log(`Ship Destination: (${this.destination!.x.toFixed(2)}, ${this.destination!.y.toFixed(2)}, ${this.destination!.z.toFixed(2)})`)
        // console.log(`${this.flightPlanBuffer.length} jump points remain`)
        // console.log(`Distance To: (${this.distanceRemaining.toFixed(2)})`)

        // console.log(this.physicsState.toString())
      }
    }

    this.updateTimeToArrivalDisplay(this.distanceRemaining)
  }

  private hasDestination() {
    return this.destination != undefined
  }

  private isUnderway() {
    return this.hasDestination() && this.flightPlanActive
  }

  private hasArrivedAtDestination() {
    return this.distanceRemaining < (this.toleranceDistance + this.physicsState.velocity.magnitude())
  }

  updateTimeToArrivalDisplay(
    distance: number
  ) {
    // Calculate the estimated time to arrival in seconds
    let estimatedTimeToArrival = this.physicsState.eta(distance)

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
      // console.log(this.data.value.timeToArrivalDisplay, this.uuid)
    }

  }

  handleCoordinateArrival() {
    this.physicsState.position = this.destination!
    if (this.advanceFlightPlan()) {
      this.flightPlanActive = true
    } else {
      this.flightPlanActive = false
      console.log(`Ship has reached destination via route: ${this.data.value.path}`)
      this.createFakeFlightplan()
      this.deliveryCt++

    }
  }
}
