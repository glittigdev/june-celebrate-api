const Model = require('../models/transaction_model');

class TransactionRepository {
  async createTransaction(data) {
	return await Model(data).save();
  }
}

module.exports = new TransactionRepository();
