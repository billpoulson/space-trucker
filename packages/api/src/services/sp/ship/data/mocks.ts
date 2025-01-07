import { ShipStats } from '@space-truckers/types'

export function createMockShipStats(): ShipStats {
  return {
    shipType: 'Arcadian Vx Class',
    maxSpeed: 100,
    accelerationData: [
      { time: 0, speed: 0 },
      { time: 10, speed: 10 },
      { time: 20, speed: 30 },
      { time: 30, speed: 50 },
      { time: 50, speed: 70 },
      { time: 60, speed: 100 },
    ]
  }
}



