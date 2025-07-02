const Model = require('../models/person_model');

class PersonRepository {
  async createPerson(data) {
    return await Model(data).save();
  }
}

module.exports = new PersonRepository();
