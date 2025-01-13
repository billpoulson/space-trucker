
export const resolveSpeedLimit = (distanceToTarget: number): number => {
  let r = 200
  if (distanceToTarget <= 1000) {
    r = 8
  }
  if (distanceToTarget <= 500) {
    r = 4
  }
  if (distanceToTarget <= 100) {
    r = 2
  }
  if (distanceToTarget <= 50) {
    r = 1
  }
  if (distanceToTarget <= 10) {
    r = 0
  }
  return r
}
