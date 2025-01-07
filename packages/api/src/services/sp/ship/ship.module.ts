import { UserInfoObject } from '@space-truckers/types'
import { DependencyContainer } from 'tsyringe'
import { Ship } from './ship'
import { ShipLoaderService } from './ship-loader-service'
import { ShipNavComputer } from './ship-nav-computer'
import { ShipPosition } from './ship-position'

export async function createShip(scope: DependencyContainer) {
  const c = scope
    .createChildContainer()
    .registerInstance(UserInfoObject, {} as any)
    .registerSingleton(ShipLoaderService)
    .registerSingleton(ShipPosition)
    .registerSingleton(ShipNavComputer)
    .registerSingleton(Ship)


  return c.resolve(Ship)
}