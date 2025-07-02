const Joi = require('joi');

const create = Joi.object({
  product: Joi.string().required(),
  qtd: Joi.number().required(),
  value: Joi.number().required(),
  type: Joi.string().required()
});

module.exports = {
  create,
};
