const ProductService = require('../services/product_service');

class ProductController {
  async createProduct(req, res) {
    try {
      const body = req.body;
      const results = await ProductService.createProduct(body);
      res.status(200).json(results);
    } catch (err) {
      console.log('error->createProduct: ', err);
      res.status(400).json({ err: 'err_created_products' });
    }
  }

  async productInfo(req, res) {
    try {
      const { id } = req.query
      const results = await ProductService.productInfo(id);
      res.status(200).json(results);
    } catch (err) {
      console.log('error->productInfo: ', err);
      res.status(400).json({ err: 'err_created_products' });
    }
  }

}

module.exports = ProductController;
