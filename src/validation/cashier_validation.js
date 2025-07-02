const Joi = require('joi');

const linkin = Joi.object({
  card: Joi.string().required(),
  name: Joi.string().required(),
  value: Joi.number().required(),
  visitor: Joi.boolean().default(false).optional(),
  depositType: Joi.string()
    .valid('PIX', 'CREDITO', 'DINHEIRO', 'DEBITO')
    .required(),
  operationType: Joi.string()
    .valid('LINK', 'RECHARGE', 'WITHDRAWAL', 'DONATION')
    .required(),
});

const recharge = Joi.object({
  card: Joi.string().required(),
  value: Joi.number().required(),
  depositType: Joi.string()
    .valid('PIX', 'CREDITO', 'DINHEIRO', 'DEBITO')
    .required(),
});

const withdrawal = Joi.object({
  card: Joi.string().required(),
});

const donation = Joi.object({
  card: Joi.string().required(),
});

module.exports = {
  linkin,
  recharge,
  withdrawal,
  donation
};
