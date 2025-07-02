const Controller = require('../controllers/stand_controller.js');

const Router = function (router, db) {
  let controller = new Controller(db);

  router.route('/stand/register').post(controller.createStand.bind(controller));

  router.route('/stand/login')
    .post(controller.standLogin.bind(controller));

  router.route('/stand/sale')
    .get(controller.takeCardInformation.bind(controller))
    .post(controller.selingProduct.bind(controller));

  router.route('/stand/info')
    .get(controller.takeStands.bind(controller))
};

module.exports = Router;
