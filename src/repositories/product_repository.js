const Model = require('../models/product_model');

class ProductRepository {
  async createProduct(data) {
    return await Model(data).save();
  }

  async findOne(filter) {
    return await Model.findOne(filter);
  }

  async aggregate(filter) {
    return await Model.aggregate(filter);
  }
}

module.exports = new ProductRepository();
