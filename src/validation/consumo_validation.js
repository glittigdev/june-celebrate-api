const Joi = require('joi');

const registrar = Joi.object({
  senha: Joi.string().optional().allow(''),
  produtoId: Joi.string().required().messages({
    'any.required': 'Produto é obrigatório.',
  }),
  quantidade: Joi.number().min(1).required().messages({
    'number.min': 'Quantidade deve ser maior que zero.',
    'any.required': 'Quantidade é obrigatória.',
  }),
  valorTotal: Joi.number().min(0).required().messages({
    'any.required': 'Valor total é obrigatório.',
  }),
  codigoCartao: Joi.string().required().messages({
    'any.required': 'Código do cartão (QR Code) é obrigatório.',
  }),
  barracaId: Joi.string().required().messages({
    'any.required': 'ID da barraca é obrigatório.',
  }),
});

module.exports = { registrar };
