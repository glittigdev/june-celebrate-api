'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/helper');
const { DepositType, OperationType } = require('../domains/enum');


let SchemaPerson = Schema(
  {
	  value_deposit: {
	 	  type: Schema.Types.Number,
      default: 0,
	  },
	  deposit_type: {
      type: Schema.Types.String,
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
  },
  {
	  timestamps: true,
  }
);

helper.addTimestamps(SchemaPerson);

module.exports = mongoose.model('LogDeposit', SchemaPerson);
