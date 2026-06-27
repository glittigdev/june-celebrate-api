'use strict';

const ConsumoService = require('../services/consumo_service');
const BaseController = require('../base/base_controller');

class ConsumoController extends BaseController {
  async registrarConsumo(req, res) {
    try {
      const result = await ConsumoService.registrarConsumo(req.body);
      const response = this.middlewareResponse(result.status, 'consumo_result', result.data);
      res.json(response);
    } catch (err) {
      const response = this.middlewareResponse(500, 'consumo_error', {
        message: 'Erro interno do servidor.',
      });
      res.json(response);
    }
  }
}

module.exports = ConsumoController;
