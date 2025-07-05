// Service
const TransactionService = require('../services/transaction_service');

// Enum
const { TypeTransaction } = require('../domains/enum');

// Repositorie
const StandRepository = require('../repositories/stand_repository');
const CardRepository = require('../repositories/card_repository');
const CashierRepository = require('../repositories/cashier_repository');

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
    console.log('---------------')
    console.log(cardId, body)
    console.log('---------------')
    try {
      await Validate.sale.validateAsync(body);

      // Validar código
      if (body.code !== '1517') {
        throw new Error('Código de validação incorreto')
      }

      // verificar existencia do cartão
      const card = await CardRepository.findById(cardId);
      if (!card) {
        throw new Error('Cartão não encontrado');
      }

      // valor disponível no cartão é maior ou igual ao valor de compra
      if (card.value_available <= body.value) {
        throw new Error('Saldo insuficiente!');
      }

      // Registrar vendas (de guê?)
      const payload = {
        product: body.product,
        qtd: body.qtd,
        value: body.value,
        type: TypeTransaction.PRODUCT
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

      return { message: 'register_value', card: cardUpdated };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao buscar informações do cartão');
    }
  }

  async takeStands() {
    try {
      const filter = [
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
