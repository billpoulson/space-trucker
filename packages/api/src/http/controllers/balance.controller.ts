import { Request, Response } from 'express'

export default () => {
  const express = require('express')
  const router = express.Router()

  router.use((req, res, next) => {
    debugger
    req.customData = {
      message: 'Hello from middleware',
      timestamp: new Date(),
    };
    next(); // Pass control to the next middleware/handler
  });

  router.get('/getBalance', async (req: Request, res: Response) => {
    res.send('$1000.00')
  })

  // Define routes for the "users" module
  router.get('/', (req, res) => {
    res.send('List of users')
  })

  router.get('/:id', (req, res) => {
    res.send(`User details for ID: ${req.params.id}`)
  })

  router.post('/', (req, res) => {
    res.send('Create a new user')
  })

  return router
}
