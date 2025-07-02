const Model = require('../models/stand_model');

class StandRepository {
  async createStand(data) {
    return await Model(data).save();
  }

  async findStand(filter) {
    return await Model.findOne(filter);
  }

  async aggregate(filter) {
    return await Model.aggregate(filter);
  }
}

module.exports = new StandRepository();
