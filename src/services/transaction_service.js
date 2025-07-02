const TransactionRepository = require('../repositories/transaction_repository');
const StandRepository = require('../repositories/stand_repository');
const CardRepository = require('../repositories/card_repository');
const Validate = require('../validation/transaction_validation');

class TransactionService {
  async createTransaction(cardId, body) {
		try {
			await Validate.create.validateAsync(body);
			
			// Verificar existencia do cartão
			const card = await CardRepository.findById(cardId);
			if (!card) {
				throw new Error('Cartão não encontrado');
			}

			// Cadastrar transação
			const payload = {
				card: card._id,
				product: body.product,
				qtd: body.qtd,
				value_total_operation: body.value,
				type: body.type
			}

			const transaction = await TransactionRepository.createTransaction(payload);

			return transaction;
		} catch (error) {
			console.log(error);
			throw new Error('Erro ao criar novo produto');
		}
  }
}

module.exports = new TransactionService();