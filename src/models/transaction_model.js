'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/helper');
const { TypeTransaction } = require('../domains/enum'); 

let SchemaTransaction = Schema(
  {
    card: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      index: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      index: true,
    },
    stand: {
      type: Schema.Types.ObjectId,
      ref: 'Stands',
      index: true,
    },
    qtd: {
      type: Schema.Types.Number,
      required: true,
    },
    value_total_operation: {
      type: Schema.Types.Number,
      required: true,
    },
    product_value: {
      type: Schema.Types.Number,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      enum: [
        TypeTransaction.DONATION,
        TypeTransaction.PRODUCT
      ],
    }
  },
  {
    timestamps: true,
  }
);

helper.addTimestamps(SchemaTransaction);

module.exports = mongoose.model('Transaction', SchemaTransaction);
