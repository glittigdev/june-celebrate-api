const Model = require('../models/card_model');

class CashierRepository {
  async findCashiers(filter = {}) {
    return await Model.findOne(filter);
  }

  async linkCardWithPerson(id, data) {
    return await Model.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new CashierRepository();
