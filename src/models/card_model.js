'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/helper');
const { StatusCard, DepositType, OperationType } = require('../domains/enum');

let SchemaCard = Schema(
  {
    card: {
      type: Schema.Types.String,
      required: true,
      index: true,
    },
    status: {
      type: Schema.Types.String,
      enum: [StatusCard.COMPLETED, StatusCard.IN_USE, StatusCard.VIRGIN],
      default: StatusCard.VIRGIN,
    },
    person: {
      type: Schema.Types.ObjectId,
      ref: 'Persons',
      index: true,
    },
    value_available: {
      type: Schema.Types.Number,
      default: 0,
    },
    total_value: {
      type: Schema.Types.Number,
      default: 0,
    },
    return_value: {
      type: Schema.Types.Number,
      default: 0,
    },
    deposit_type: {
      type: Schema.Types.Mixed,
      enum: [
        DepositType.CASH,
        DepositType.CREDIT,
        DepositType.DEBIT,
        DepositType.PIX,
      ],
    },
    operation_type: {
      type: Schema.Types.Mixed,
      enum: [
        OperationType.DONATION,
        OperationType.LINK,
        OperationType.RECHARGE,
        OperationType.WITHDRAWAL,
      ],
    },
    url_qrCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

helper.addTimestamps(SchemaCard);

module.exports = mongoose.model('Card', SchemaCard);
