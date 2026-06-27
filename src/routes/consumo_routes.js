const Controller = require('../controllers/consumo_controller.js');

const Router = function (router) {
  const controller = new Controller();

  router.route('/consumo').post(controller.registrarConsumo.bind(controller));
};

module.exports = Router;
