'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/helper');

let SchemaPerson = Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    visitor: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

helper.addTimestamps(SchemaPerson);

module.exports = mongoose.model('Person', SchemaPerson);
