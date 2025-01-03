export interface LoadDefinitionData {
  inProgress: boolean
  percentageCompleted: number
  isCompleted: boolean
  key: string
  mass: number
  cargoValue: number,
  payout: number,
  distance: number,
  progress: number,
  pirated: boolean,
}

export function createLoadDefinitionData(
): LoadDefinitionData {

  return {
    key: '-1',
    cargoValue: 100,
    distance: 1000,
    mass: 10000,
    payout: 1000,
    inProgress: false,
    progress: 0,
    pirated: false,
    isCompleted: false,
    percentageCompleted: 0
  }
}
