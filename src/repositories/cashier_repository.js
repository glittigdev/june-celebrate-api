const Model = require('../models/card_model');

class CashierRepository {
  async findCashiers(filter = {}) {
    return await Model.findOne(filter);
  }

  async linkCardWithPerson(id, data, session) {
    return await Model.findByIdAndUpdate(id, data, { new: true, session });
  }
}

module.exports = new CashierRepository();
