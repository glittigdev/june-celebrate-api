// Service
const TransactionService = require('../services/transaction_service');

// Enum
const { TypeTransaction } = require('../domains/enum');

// Repositorie
const StandRepository = require('../repositories/stand_repository');
const CardRepository = require('../repositories/card_repository');
const CashierRepository = require('../repositories/cashier_repository');
const ProductRepository = require('../repositories/product_repository');

// Validate
const Validate = require('../validation/stand_validation');

class StandService {
  async createStand(body) {
    try {
      await Validate.create.validateAsync(body);

      // Cadastrar stand
      const payload = {
        name: body.name,
        responsible: body.responsible,
      };

      StandRepository.createStand(payload);
      return { message: 'stand_create_success' };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao criar novo Stand');
    }
  }

  async takeCardInformationToSeling(cardId) {
    try {
      // Busca informações do cartão para realizar a venda
      const card = await CardRepository.findCardInformation(cardId);

      return { message: 'take_information', card };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao buscar informações do cartão');
    }
  }

  async registerSale(cardId, body) {
    try {
      await Validate.sale.validateAsync(body);

      // Validar código
      if (body.code !== '1517') {
        throw new Error('Senha de inválida!')
      }

      // verificar existencia do cartão
      const card = await CardRepository.findById(cardId);
      if (!card) {
        throw new Error('Cartão não encontrado');
      }

      // valor disponível no cartão é maior ou igual ao valor de compra
      if (card.value_available < body.value) {
        throw new Error('Saldo insuficiente!');
      } 

      const product = await ProductRepository.findOne({ _id: body.product})

      // Registrar vendas;
      const payload = {
        product: body.product,
        stand: body.stand,
        qtd: body.qtd,
        value: body.value,
        type: TypeTransaction.PRODUCT,
        product_value: product.value
      }

      const transaction = await TransactionService.createTransaction(cardId, payload)
      if (!transaction) {
        throw new Error('Não foi possível registrar a venda!');
      }

      // Atualizar o cartão do usuário
      const updateCard = {
        value_available: card.value_available - body.value
      }

      const cardUpdated = await CashierRepository.linkCardWithPerson(card._id, updateCard);

      return {
        data: {
          message: `Venda realizada com sucesso! Novo saldo: ${cardUpdated.value_available}`,
          balance: cardUpdated.value_available,
        },
        status: 201
      };
    } catch (error) {
      return { 
        data: { 
          message: error.message 
        }, 
        status: 400 
      };
    }
  }

  async takeStands() {
    try {
      const filter = [
        {
          $match: {
            name: { $ne: 'Caixa'}
          }
        },
        {
          $project: {
            name: 1
          }
        }
      ]

      // Busca informações do cartão para realizar a venda
      const stand = await StandRepository.aggregate(filter);

      return { message: 'take_stand_information', stand };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao buscar informações do cartão');
    }
  }
}

module.exports = new StandService();
