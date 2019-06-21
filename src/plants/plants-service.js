const PlantsService = {
    getAllPlants(knex) {
      return knex.select('*').from('plants')
    },
  
    insertPlant(knex, newPlant) {
      return knex
        .insert(newPlant)
        .into('plants')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('plants')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deletePlant(knex, id) {
      return knex('plants')
        .where({ id })
        .delete()
    },
  
    updatePlant(knex, id, newPlantFields) {
      return knex('plants')
        .where({ id })
        .update(newPlantFields)
    },
  }
  
  module.exports = PlantsService