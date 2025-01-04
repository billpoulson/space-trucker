import { isInRange } from './functions/isInRange'
import { Point } from './point'
import { getRandomInclusive } from './random/getRandomInclusive'
import { Vector3Boundary } from './vector3-boundary'

export class Vector3 {
  x: Point
  y: Point
  z: Point
  static create = ([x, y, z]: [Point, Point, Point]): Vector3 => ({ x, y, z })
  static multiply = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x * b.x, y: a.y * b.y, z: a.z * b.z })
  static add = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })
  static multiplyBy = (a: Vector3, b: number): Vector3 => ({ x: a.x * b, y: a.y * b, z: a.z * b })
  static divideBy = (a: Vector3, b: number): Vector3 => ({ x: a.x / b, y: a.y / b, z: a.z / b })
  static square = (val: number): Vector3 => ({ x: val, y: val, z: val })
  static zero: Vector3 = Vector3.square(0)
  static one: Vector3 = Vector3.square(1)
  static negativeOne: Vector3 = Vector3.square(-1)
  toString = (): string => `${this.x}.${this.y}.${this.z}`


  static random = ({ root, limit }: Vector3Boundary): Vector3 => ({
    x: getRandomInclusive(root.x, limit.x),
    y: getRandomInclusive(root.y, limit.y),
    z: getRandomInclusive(root.z, limit.z),
  })

  private static getIntersectingAxis = (
    {
      root: { x: rx, y: ry, z: rz },
      limit: { x: lx, y: ly, z: lz }
    }: Vector3Boundary,
    { x: tx, y: ty, z: tz }: Vector3
  ) => ({
    x: isInRange(rx, lx, tx),
    y: isInRange(ry, ly, ty),
    z: isInRange(rz, lz, tz)
  })

  static isWithinBoundary = (boundary: Vector3Boundary, position: Vector3) => {
    const { x, y, z } = Vector3.getIntersectingAxis(boundary, position)
    return x && y && z
  }
}
