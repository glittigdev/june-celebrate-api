const Controller = require('../controllers/card_controller.js');

const Router = function (router, db) {
  let controller = new Controller(db);

  router
    .route('/card/generate-cards')
    .get(controller.generateCards.bind(controller));
};

module.exports = Router;
