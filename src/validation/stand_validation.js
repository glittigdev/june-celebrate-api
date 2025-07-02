const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().required(),
  responsible: Joi.string().required(),
});

const sale = Joi.object({
  code: Joi.string().required(),
  product: Joi.string().required(),
  qtd: Joi.number().required(),
  value: Joi.number().required()
});

module.exports = {
  create,
  sale
};
