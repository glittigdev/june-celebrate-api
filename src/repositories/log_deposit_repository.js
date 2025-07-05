const Model = require('../models/log_deposit_model');

class LogDepositRepository {
  async createDeposit(data) {
	return await Model(data).save();
  }
}

module.exports = new LogDepositRepository();
