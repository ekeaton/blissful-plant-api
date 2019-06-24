const path = require('path')
const express = require('express')
const xss = require('xss')
const PlantsService = require('./plants-service')

const plantsRouter = express.Router()
const jsonParser = express.json()

const serializePlants = plant => ({
    id: plant.id,
    name: xss(plant.name),
    note: plant.note,
    num_days: plant.num_days,
    water_date: plant.water_date,
  })

plantsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')  
    PlantsService.getAllPlants(knexInstance)
      .then(plant => {
        res.json(plant.map(serializePlants))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { id, name, num_days, water_date, note } = req.body
    const newPlant = { id, name, num_days, water_date}

    for (const [key, value] of Object.entries(newPlant)) 
       if (value == null) 
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
    newPlant.note = note;

    PlantsService.insertPlant(
      req.app.get('db'),
      newPlant
    )
      .then(plant => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${plant.id}`))
          .json(serializePlants(plant))
      })
      .catch(next)
  })

plantsRouter
  .route('/:id')
  .all((req, res, next) => {
       PlantsService.getById(
        req.app.get('db'),
        req.params.id
     )
      .then(plant => {
        if (!plant) {
            return res.status(404).json({
                 error: { message: `Plant doesn't exist` }
               })
        }
          res.plant = plant 
          next() // don't forget to call next so the next middleware happens!
        })
        .catch(next)
   })
   .get((req, res, next) => {
    res.json(serializePlants(res.plant))
  })
  .delete((req, res, next) => {
    PlantsService.deletePlant(
        req.app.get('db'),
        req.params.id
      )
        .then(() => {
           res.status(204).end()
        })
        .catch(next)
   })
   .patch(jsonParser, (req, res, next) => {
    const { id, name, num_days, note, water_date } = req.body
    const plantToUpdate = { id, note, water_date, name, num_days }

    const numberOfValues = Object.values(plantToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'note', 'name', 'num_days' or 'water_date'`
        }
      })

    PlantsService.updatePlant(
      req.app.get('db'),
      req.params.id,
      plantToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


module.exports = plantsRouter