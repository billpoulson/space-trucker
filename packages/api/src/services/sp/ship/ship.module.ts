import { UserInfoObject } from '@space-truckers/types'
import { DependencyContainer } from 'tsyringe'
import { LocationCoordinates } from '../cosmic-volume/location-coordinates'
import { Ship } from './model/ship'
import { ShipNavComputer } from './model/ship-nav-computer'

export async function createShip(
  container: DependencyContainer
) {
  const childContainer = container
    .createChildContainer()
    .registerInstance(UserInfoObject, {} as any)
    .registerSingleton(LocationCoordinates)
    .registerSingleton(ShipNavComputer)
    .registerSingleton(Ship)

  return childContainer.resolve(Ship)
}