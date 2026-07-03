const Controller = require('../controllers/card_controller.js');

const Router = function (router, db) {
  let controller = new Controller(db);

  router
    .route('/card/generate-cards')
    .get(controller.generateCards.bind(controller));

  router
    .route('/card/info/:id')
    .get(controller.getCardInfo.bind(controller));
};

module.exports = Router;
