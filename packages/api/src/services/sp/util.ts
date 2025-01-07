import { Quaternion, Vector3 } from '@space-truckers/common'

function animate() {

  // Define the position of the star
  const starPosition = Vector3.createVector3([100, 100, 100])

  // Initialize the ship's position and orientation (identity quaternion - no rotation)
  let shipPosition = Vector3.createVector3([0, 0, 0])
  let orientation = Quaternion.createQuaternion([1, 0, 0, 0]) // Starting with the identity quaternion

  // Define a velocity for the ship to start moving toward the star
  const speed = 0.5
  let velocity = starPosition.subtract(shipPosition).normalize().scale(speed)

  // Simulation loop
  // const deltaTime = 0.016 // Assuming 60 FPS
  let lastTime = performance.now()

  let simulationRunning = true
  const toleranceDistance = 1.0 // Stop when close enough

  while (simulationRunning) {
    const currentTime = performance.now()
    const deltaTime = (currentTime - lastTime) / 1000
    lastTime = currentTime
    // Update the ship's position
    shipPosition = shipPosition.add(velocity.scale(deltaTime))

    // Check if the ship is close enough to the star
    if (shipPosition.subtract(starPosition)
      .normalize()
      .scale(speed)
      .subtract(Vector3.createVector3([0, 0, 0]))
      .normalize()
      .scale(toleranceDistance).x < toleranceDistance) {
      simulationRunning = false
      console.log("Ship has reached the star!")
    }

    // Adjust the orientation to face the star as it moves
    const desiredDirection = starPosition.subtract(shipPosition).normalize()

    // Calculate a quaternion to rotate towards the desired direction
    const currentDirection = orientation.rotateVector(Vector3.createVector3([0, 0, 1])) // Assuming initial "forward" direction along z-axis

    // Calculate angle and axis to rotate toward the desired direction
    const dotProduct = currentDirection.x * desiredDirection.x + currentDirection.y * desiredDirection.y + currentDirection.z * desiredDirection.z
    const angle = Math.acos(dotProduct) * (180 / Math.PI)

    if (angle > 0.1) {  // A small threshold to avoid jitter when already aligned
      const rotationAxis = Vector3.createVector3([
        currentDirection.y * desiredDirection.z - currentDirection.z * desiredDirection.y,
        currentDirection.z * desiredDirection.x - currentDirection.x * desiredDirection.z,
        currentDirection.x * desiredDirection.y - currentDirection.y * desiredDirection.x
      ]).normalize()

      const rotationQuaternion = Quaternion.fromAxisAngle(rotationAxis, angle * deltaTime)
      orientation = orientation.multiply(rotationQuaternion).normalize()
    }

    console.log(`Ship Position: (${shipPosition.x.toFixed(2)}, ${shipPosition.y.toFixed(2)}, ${shipPosition.z.toFixed(2)})`)
    console.log(`Orientation: (${orientation.w.toFixed(3)}, ${orientation.x.toFixed(3)}, ${orientation.y.toFixed(3)}, ${orientation.z.toFixed(3)})`)
  }
}

function simulateFn2(x: () => void) {
  // Main simulation loop
  let lastTime = performance.now()
  let position = Vector3.zero
  let velocity = Vector3.zero
  function update() {
    // Get the current time
    const currentTime = performance.now()

    // Calculate delta time in seconds
    const deltaTime = (currentTime - lastTime) / 1000

    // Update the last time to the current time
    lastTime = currentTime

    // Example of updating a position with velocity
    // Assuming `velocity` and `position` are defined vectors
    position = position.add(velocity.scale(deltaTime))

    // Log or use delta time for further calculations
    console.log(`Delta Time: ${deltaTime.toFixed(4)} seconds`)

    // Request the next frame (for browsers)
    requestAnimationFrame(update)
  }

  // Start the simulation
  update()
}

function simulateFn() {
  // Main simulation loop
  let lastTime = performance.now()

  function update() {
    // Get the current time
    const currentTime = performance.now()

    // Calculate delta time in seconds
    const deltaTime = (currentTime - lastTime) / 1000

    // Update the last time to the current time
    lastTime = currentTime

    // Example of updating a position with velocity
    // Assuming `velocity` and `position` are defined vectors
    // position = position.add(velocity.scale(deltaTime));

    // Log or use delta time for further calculations
    console.log(`Delta Time: ${deltaTime.toFixed(4)} seconds`)

    // Request the next frame (for browsers)
    requestAnimationFrame(update)
  }

  // Start the simulation
  update()
}