import { Vector3 } from '@space-truckers/common'

export type GraphConnection<TData> = [TData, TData]
export type Edge = GraphConnection<Vector3>
export type Graph = Map<Vector3, { node: Vector3; weight: number }[]>


function generateNodeGraph(
  points: Vector3[],
  maxDistance: number
): [Vector3, Vector3][] {
  const treeEdges: Array<Edge> = []
  const usedPoints = new Set<Vector3>()
  const availablePoints = new Set(points)

  // Start with the first point as the root
  let currentPoint = points[0]
  usedPoints.add(currentPoint)
  availablePoints.delete(currentPoint)

  // Continue until all points are connected
  while (availablePoints.size > 0) {
    let nearestPoint: Vector3 | null = null
    let nearestDistance = Infinity

    // Find the nearest neighbor to the current point within the maxDistance
    availablePoints.forEach((point) => {
      const dist = currentPoint.distanceTo(point)
      if (dist < nearestDistance && dist <= maxDistance) {
        nearestDistance = dist
        nearestPoint = point
      }
    })

    if (nearestPoint) {
      // Connect the current point to the nearest neighbor
      treeEdges.push([currentPoint, nearestPoint])

      // Update sets
      availablePoints.delete(nearestPoint)
      usedPoints.add(nearestPoint)

      // Move to the nearest point
      currentPoint = nearestPoint
    } else {
      // No valid neighbors within range, break out of the loop
      break
    }
  }

  return treeEdges
}

function createGraph(
  edges: Edge[]
): Graph {
  const graph: Graph = new Map()

  edges.forEach(([start, end]) => {
    const weight = start.distanceTo(end)
    if (!graph.has(start)) {
      graph.set(start, [])
    }
    if (!graph.has(end)) {
      graph.set(end, [])
    }
    graph.get(start)!.push({ node: end, weight })
    graph.get(end)!.push({ node: start, weight }) // Since it's an undirected graph
  })

  return graph
}

function findShortestPath(
  graph: Graph,
  link: Edge
): { path: Vector3[]; distance: number } {
  const [start, end] = link
  const distances = new Map<Vector3, number>()
  const previous = new Map<Vector3, Vector3 | null>()
  const unvisited = new Set<Vector3>()

  // Initialize distances and unvisited set
  graph.forEach((_, node) => {
    distances.set(node, Infinity)
    previous.set(node, null)
    unvisited.add(node)
  })

  distances.set(start, 0)

  while (unvisited.size > 0) {
    // Get the node with the smallest distance
    const current = Array.from(unvisited).reduce((minNode, node) =>
      distances.get(node)! < distances.get(minNode)! ? node : minNode
    )

    if (current === end) break // Stop if we've reached the destination

    unvisited.delete(current)

    // Update distances to neighbors
    const neighbors = graph.get(current) || []
    for (const { node: neighbor, weight } of neighbors) {
      if (!unvisited.has(neighbor)) continue

      const newDist = distances.get(current)! + weight
      if (newDist < distances.get(neighbor)!) {
        distances.set(neighbor, newDist)
        previous.set(neighbor, current)
      }
    }
  }

  // Reconstruct the shortest path
  const path: Vector3[] = []
  let current: Vector3 | null = end
  while (current) {
    path.unshift(current)
    current = previous.get(current)!
  }

  const totalDistance = distances.get(end) || Infinity
  return { path, distance: totalDistance }
}