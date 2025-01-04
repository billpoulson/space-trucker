import { Point } from './point'

export class Vector2 {
  x: Point
  y: Point
  static multiply = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x * b.x, y: a.y * b.y })
}
