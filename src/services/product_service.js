const ProductRepository = require('../repositories/product_repository');
const StandRepository = require('../repositories/stand_repository');
const Validate = require('../validation/product_validation');
const mongoose = require('mongoose');

class ProductService {
  async createProduct(body) {
    try {
      await Validate.create.validateAsync(body);

      // Buscar pela barraca
      const stand = await StandRepository.findStand({ name: body.stand });
      if (!stand) {
        throw new Error('Barraca não encontrada');
      }

      const payload = {
        name: body.name,
        value: body.value,
        stand: stand._id,
        qtd_available: body.qtd_available || 0
      }

      // Cadastrar produto
      await ProductRepository.createProduct(payload)

      return { message: 'create_product_success' };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao criar novo produto');
    }
  }

  async productInfo(id) {
    try {
      const filter = [
        {
          $match: {
            stand: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $project: {
            name: 1,
            value: 1
          }
        }
      ]

      // Busca informações do cartão para realizar a venda
      const products = await ProductRepository.aggregate(filter);

      return { message: 'take_product_information', products };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao buscar informações do produto');
    }
  }
}

module.exports = new ProductService();
