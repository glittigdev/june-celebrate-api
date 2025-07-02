const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  stand: Joi.string().required(),
  qtd_available: Joi.number().optional(),
});

module.exports = {
  create,
};
