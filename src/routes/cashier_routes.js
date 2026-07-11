const Controller = require('../controllers/cashier_controller.js');

const Router = function (router, db) {
  let controller = new Controller(db);

  router
    .route('/cashier/link-card')
    .post(controller.createLinkCard.bind(controller));

  router
    .route('/cashier/recharge')
    .post(controller.rechargeCard.bind(controller));

  router
    .route('/cashier/withdrawal')
    .post(controller.withdrawalCard.bind(controller));

  router
    .route('/cashier/donation')
    .post(controller.donationCard.bind(controller));

  router
    .route('/cashier/transfer')
    .post(controller.transferCard.bind(controller));
};

module.exports = Router;
