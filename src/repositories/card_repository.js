const Model = require('../models/card_model');
const mongoose = require('mongoose');

class CardRepository {
  async findOne(card, session) {
    return await Model.findOne({ card }).session(session);
  }

  async insertManyCards(data) {
    return await Model.insertMany(data);
  }

  async findCardAndInsertURL(id, data) {
    return await Model.findByIdAndUpdate(id, data);
  }

  async findById(id) {
    return await Model.findById(id);
  }

  async findCardWithTransactions(id) {
    const TransactionModel = require('../models/transaction_model');

    const card = await Model.findById(id);
    if (!card) return null;

    const transactions = await TransactionModel.aggregate([
      { $match: { card: new mongoose.Types.ObjectId(id) } },
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
      { $lookup: { from: 'stands', localField: 'stand', foreignField: '_id', as: 'stand' } },
      {
        $addFields: {
          product: { $arrayElemAt: ['$product', 0] },
          stand: { $arrayElemAt: ['$stand', 0] },
        },
      },
      {
        $project: {
          createdAt: 1, type: 1, qtd: 1, product_value: 1, value_total_operation: 1,
          'product._id': 1, 'product.name': 1,
          'stand._id': 1, 'stand.name': 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return { card, transactions };
  }

  async findCardInformation(id) {
    const filter = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'people',
          localField: 'person',
          foreignField: '_id',
          as: 'person'
        }
      },
      {
        $project: {
          person: {$arrayElemAt: ['$person.name', 0]},
          value_available: 1,
          status: 1
        }
      }
    ];

    const result = await Model.aggregate(filter)
    return result[0] ; 
  }
}

module.exports = new CardRepository();
