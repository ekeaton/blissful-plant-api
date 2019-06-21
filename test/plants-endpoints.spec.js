const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makePlantsArray, makeMaliciousPlant } = require('./plants.fixtures')

describe('Plants Endpoints', function() {
let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('plants').truncate())

  afterEach('cleanup', () => db('plants').truncate())

  describe(`GET /api/plants`, () => {
    context(`Given no plants`, () => {
       it(`responds with 200 and an empty list`, () => {
            return supertest(app)
            .get('/api/plants')
            .expect(200, [])
        })
    })
    context('Given there are plants in the database', () => {
      const testPlants = makePlantsArray()

      beforeEach('insert plants', () => {
        return db
          .into('plants')
          .insert(testPlants)
      })

      it('responds with 200 and all of the plants', () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, testPlants)
      })
    })

    context(`Given an XSS attack plant`, () => {
        const { maliciousPlant, expectedPlant } = makeMaliciousPlant()
  
        beforeEach('insert malicious plant', () => {
          return db
            .into('plants')
            .insert([ maliciousPlant ])
        })
  
        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/plants`)
            .expect(200)
            .expect(res => {
              expect(res.body[0].name).to.eql(expectedPlant.name)
              expect(res.body[0].note).to.eql(expectedPlant.note)
            })

          })
        })
     })

  describe(`GET /api/plants/:plant_id`, () => {
    context(`Given no plants`, () => {
      it(`responds with 404`, () => {
        const plantId = 123456
        return supertest(app)
         .get(`/api/plants/${plantId}`)
         .expect(404, { error: { message: `Plant doesn't exist` } })
        })
    })
        
    context('Given there are plants in the database', () => {
      const testPlants = makePlantsArray()

      beforeEach('insert plants', () => {
        return db
          .into('plants')
          .insert(testPlants)
      })

      it('responds with 200 and the specified plant', () => {
        const plantId = 2
        const expectedPlant = testPlants[plantId - 1]
        return supertest(app)
          .get(`/api/plants/${plantId}`)
          .expect(200, expectedPlant)
      })
    })
    
    context(`Given an XSS attack plant`, () => {
        const { maliciousPlant, expectedPlant } = makeMaliciousPlant()
  
        beforeEach('insert malicious plant', () => {
          return db
            .into('plants')
            .insert([ maliciousPlant ])
        })
  
        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/plants/${maliciousPlant.id}`)
            .expect(200)
            .expect(res => {
              expect(res.body.name).to.eql(expectedPlant.name)
              expect(res.body.note).to.eql(expectedPlant.note)
            })
        })
     })
  })

  describe(`POST /api/plants`, () => {
    it(`creates a plant, responding with 201 and the new plant`,  function() {
        const newPlant = {
          name: 'Test new plant',
          note: "",
          num_days: 5,
          water_date: '2019-07-25',
        }
         return supertest(app)
          .post('/api/plants')
          .send(newPlant)
           .expect(201)
           .expect(res => {
             expect(res.body.name).to.eql(newPlant.name)
             expect(res.body.note).to.eql(newPlant.note)
             expect(res.body.num_days).to.eql(newPlant.num_days)
             const expected = new Date().toLocaleString()
             const actual = new Date(res.body.water_date).toLocaleString()
             expect(actual).to.eql(expected)
             expect(res.body).to.have.property('id')
             expect(res.headers.location).to.eql(`/api/plants/${res.body.id}`)
          })
          .then(postRes =>
            supertest(app)
             .get(`/api/plants/${postRes.body.id}`)
             .expect(postRes.body)
            )
       })

     const requiredFields = ['name', 'num_days', 'water_date']

     requiredFields.forEach(field => {
     const newPlant = {
       name: 'Test Plant',
       num_days: 5,
       water_date: "2019-06-25"
     }

     it(`responds with 400 and an error message when the '${field}' is missing`, () => {
       delete newPlant[field]

       return supertest(app)
         .post('/api/plants')
         .send(newPlant)
         .expect(400, {
           error: { message: `Missing '${field}' in request body` }
         })
      })
    })
    
    it('removes XSS attack content from response', () => {
        const { maliciousPlant, expectedPlant } = makeMaliciousPlant()
        return supertest(app)
          .post(`/api/plants`)
          .send(maliciousPlant)
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(expectedPlant.name)
            expect(res.body.note).to.eql(expectedPlant.note)
          })
      })

  })


  describe(`DELETE /api/plants/:plant_id`, () => {
    context(`Given no plants`, () => {
        it(`responds with 404`, () => {
         const plantId = 123456
         return supertest(app)
          .delete(`/api/plants/${plantId}`)
          .expect(404, { error: { message: `Plant doesn't exist` } })
        })
    })   
   context('Given there are plants in the database', () => {
      const testPlants = makePlantsArray()
    
         beforeEach('insert plants', () => {
           return db
             .into('plants')
             .insert(testPlants)
         })
    
         it('responds with 204 and removes the plant', () => {
           const idToRemove = 2
           const expectedPlants = testPlants.filter(plant => plant.id !== idToRemove)
           return supertest(app)
             .delete(`/api/plants/${idToRemove}`)
             .expect(204)
             .then(res =>
               supertest(app)
                 .get(`/api/plants`)
                 .expect(expectedPlants)
             )
         })
       })
    })

    describe(`PATCH /api/plants/:plant_id`, () => {
       context(`Given no plants`, () => {
         it(`responds with 404`, () => {
               const plantId = 123456
               return supertest(app)
                 .patch(`/api/plants/${plantId}`)
              .expect(404, { error: { message: `Plant doesn't exist` } })
            })
        })

        context('Given there are plants in the database', () => {
            const testPlants = makePlantsArray()
            
              beforeEach('insert plants', () => {
                   return db
                     .into('plants')
                     .insert(testPlants)
              })
            
              it('responds with 204 and updates the plant', () => {
                  const idToUpdate = 2
                   const updatePlant = {
                     name: 'updated plant name',
                     note: 'Hello plant',
                     num_days: 3,
                     water_date: '2019-08-04',
                  }
                  const expectedPlant = {
                    ...testPlants[idToUpdate - 1],
                    ...updatePlant
                  }
                   return supertest(app)
                    .patch(`/api/plants/${idToUpdate}`)
                    .send(updatePlant)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                         .get(`/api/plant/${idToUpdate}`)
                         .expect(expectedPlant)
                    )
             })

             it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                  return supertest(app)
                    .patch(`/api/plants/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                         error: {
                           message: `Request body must content either 'note', 'name', 'num_days' or 'water_date'`
                         }
                    })
                })
         })
     })
})