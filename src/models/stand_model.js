'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/helper');

let SchemaStand = Schema(
  {
    name: {
      type: Schema.Types.String,
      index: true,
    },
    responsible: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

helper.addTimestamps(SchemaStand);

module.exports = mongoose.model('Stand', SchemaStand);
