'use strict';

const CardRepository = require('../repositories/card_repository');
const ProductRepository = require('../repositories/product_repository');
const StandRepository = require('../repositories/stand_repository');
const CashierRepository = require('../repositories/cashier_repository');
const TransactionService = require('../services/transaction_service');
const Validate = require('../validation/consumo_validation');
const { TypeTransaction } = require('../domains/enum');

class ConsumoService {
  async registrarConsumo(body) {
    try {
      await Validate.registrar.validateAsync(body);

      // 1. Verificar existência da barraca
      const stand = await StandRepository.findStand({ _id: body.barracaId });
      if (!stand) {
        throw new Error('Barraca não encontrada.');
      }

      // 3. Verificar existência e disponibilidade do produto
      const product = await ProductRepository.findOne({
        _id: body.produtoId,
        active: { $ne: false },
      });
      if (!product) {
        throw new Error('Produto não encontrado ou indisponível.');
      }

      // 4. Validar que o produto pertence à barraca informada
      if (product.stand.toString() !== body.barracaId) {
        throw new Error('Produto não pertence a esta barraca.');
      }

      // 5. Verificar existência do cartão pelo QR Code (_id do cartão)
      const card = await CardRepository.findById(body.codigoCartao);
      if (!card) {
        throw new Error('Cartão não encontrado. Verifique o QR Code.');
      }

      // 6. Verificar saldo disponível
      if (card.value_available < body.valorTotal) {
        throw new Error('Saldo insuficiente para realizar esta compra.');
      }

      // 7. Registrar transação de consumo
      const transaction = await TransactionService.createTransaction(card._id, {
        product: body.produtoId,
        stand: body.barracaId,
        qtd: body.quantidade,
        value: body.valorTotal,
        type: TypeTransaction.PRODUCT,
        product_value: product.value,
      });

      if (!transaction) {
        throw new Error('Não foi possível registrar a transação.');
      }

      // 8. Debitar valor do cartão
      const cardAtualizado = await CashierRepository.linkCardWithPerson(card._id, {
        value_available: card.value_available - body.valorTotal,
      });

      return {
        data: {
          message: `Consumo registrado com sucesso! Saldo restante: R$ ${cardAtualizado.value_available.toFixed(2)}`,
          saldoRestante: cardAtualizado.value_available,
        },
        status: 201,
      };
    } catch (error) {
      return {
        data: { message: error.message },
        status: 400,
      };
    }
  }
}

module.exports = new ConsumoService();
