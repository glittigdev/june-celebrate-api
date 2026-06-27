const Controller = require('../controllers/product_controller.js');

const Router = function (router, db) {
  let controller = new Controller(db);

  router
    .route('/product/register')
    .post(controller.createProduct.bind(controller));

  router
    .route('/product/info')
    .get(controller.productInfo.bind(controller));

  router
    .route('/barraca/:id/produtos')
    .get(controller.productsByStand.bind(controller));

};

module.exports = Router;
