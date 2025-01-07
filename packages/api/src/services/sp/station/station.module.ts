import { Vector3, Vector3Boundary } from '@space-truckers/common'
import { DependencyContainer, inject } from 'tsyringe'
import { SCOPED_CONTAINER$$ } from '../../../ioc/injection-tokens'
import { ShipPosition } from '../ship/ship-position'
import { seedLocations, testBoundary } from '../util'
import { Station } from './station'
export class stationMgr {
  stations: Map<Vector3, Station> = new Map()
  constructor(
    @inject(SCOPED_CONTAINER$$) private scope: DependencyContainer
  ) {

    seedLocations(testBoundary).forEach(location => {
      this.stations.set(location, this.createStation(scope, location))
    })
    console.log(`${this.stations.size} stations created`)
    const j = testBoundary
    const stationsInRange =
      this.getStationsWithinRange(
        Vector3.random(testBoundary),
        10000,
      )
  }

  isWithinSphere(
    point: Vector3,
    origin: Vector3,
    radius: number = 5000
  ): boolean {
    // Calculate the distance between the point and the origin
    const distance = point.subtract(origin).magnitude()

    // Check if the distance is within the radius
    return distance <= radius
  }

  getStationsWithinRange(origin: Vector3, range: number) {
    const halfRange = range * 0.5 // Assuming a cube of side 10000 units
    const scanRange = new Vector3Boundary(
      origin.subtract(Vector3.createVector3([halfRange, halfRange, halfRange])),
      origin.add(Vector3.createVector3([halfRange, halfRange, halfRange]))
    )
    return Array
      .from(this.stations)
      .filter(([key, value]) =>
        Vector3.isWithinBoundary(scanRange, key)
      )
  }
  createStation(
    scope: DependencyContainer,
    stationLocation: Vector3,
  ) {
    const r = scope
      .createChildContainer()
      .registerSingleton(ShipPosition)
      .registerSingleton(Station)
      .resolve(Station)
    r.position = stationLocation
    return r
  }
}