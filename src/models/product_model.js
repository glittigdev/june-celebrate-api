'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/helper');

let SchemaProducts = Schema(
  {
    name: {
      type: Schema.Types.String,
      index: true,
    },
    value: {
      type: Schema.Types.Number,
    },
    stand: {
      type: Schema.Types.ObjectId,
      ref: 'Stand',
      index: true,
    },
    qtd_available: {
      type: Schema.Types.Number,
    },
  },
  {
    timestamps: true,
  }
);

helper.addTimestamps(SchemaProducts);

module.exports = mongoose.model('Products', SchemaProducts);
