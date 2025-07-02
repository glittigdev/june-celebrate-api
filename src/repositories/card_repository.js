const Model = require('../models/card_model');
const mongoose = require('mongoose');

class CardRepository {
  async findOne(card) {
    return await Model.findOne({ card });
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
