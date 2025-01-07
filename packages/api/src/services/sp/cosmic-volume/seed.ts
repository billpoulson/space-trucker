import { Vector3, Vector3Boundary } from '@space-truckers/common'

const cubeSize = 10000
export const testBoundary = new Vector3Boundary(
  Vector3.zero,
  Vector3.multiplyBy(Vector3.one, cubeSize * 10)
)

export function seedLocations(
  boundary: Vector3Boundary
) {
  const objectCount = cubeSize * 2
  const results: Array<Vector3> = []
  for (let i = 0; i < objectCount; i++) {
    results.push(Vector3.random(boundary))
  }
  return results
}
