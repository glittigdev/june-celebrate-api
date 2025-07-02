// Services
const TransactionService = require('../services/transaction_service');

// Repositories
const CashierRepository = require('../repositories/cashier_repository');
const PersonRepository = require('../repositories/person_repository');
const CardRepository = require('../repositories/card_repository');
const ProductRepository = require('../repositories/product_repository')

// Validation
const Validate = require('../validation/cashier_validation');

//Enum
const { StatusCard, DepositType, OperationType, TypeTransaction } = require('../domains/enum');

class CashierService {
  async linkinCardWithUser(body) {
    try {
      await Validate.linkin.validateAsync(body);

      let statusReturn = 200;

      // Buscar o card pelo número;
      const card = await CashierRepository.findCashiers({ card: body.card });
      if (!card) {
        throw new Error('Número do Cartão não encontrado');
      }

      // Validar se o card já está vinculado;
      if (card.status !== 'Virgem') {
        throw new Error('Este Cartão já está vinculado');
      }

      //Criando person
      const person = await PersonRepository.createPerson({
        name: body.name,
        visitor: body.visitor,
      });

      // Vincular person ao card
      const dataUpdateCard = {
        person: person._id,
        value_available: body.value,
        status: StatusCard.IN_USE,
        deposit_type: DepositType.fromString(body.depositType),
        operation_type: [OperationType.LINK],
        total_value: body.value,
      };

      const result = await CashierRepository.linkCardWithPerson(
        card._id,
        dataUpdateCard
      );
      if (!result) {
        throw new Error('Não foi possível vincular!');
      }

      return {
        data: {
          message: `Vínculo realizado com sucesso! Valor disponível ${result.value_available}`,
          balance: result.value_available,
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

  async rechargeCard(body) {
    try {
      await Validate.recharge.validateAsync(body);

      // Verficar se existe o cartão;
      const card = await CardRepository.findOne(body.card);
      if (!card) {
        throw new Error('Cartão não encontrado');
      }

      // Verficar status do cartão;
      if (card.status !== StatusCard.IN_USE) {
        throw new Error('Cartão não está em uso');
      }

      //TODO: Validar melhor a regra para recarga em diferente formato de depósito e também devolver o valor disponível para uso;
      // Verificar o tipo depósito realizado
      if (card.deposit_type !== DepositType.fromString(body.depositType)) {
        return { message: 'link_a_new_card' };
      }

      const operationType = card.operation_type;

      operationType.push(OperationType.RECHARGE);

      const payload = {
        value_available: card.value_available + body.value,
        operation_type: operationType,
        total_value: card.total_value + body.value,
      };

      const result = await CashierRepository.linkCardWithPerson(
        card._id,
        payload
      );

      return { message: 'recharge_card', balance: result.value_available };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao recarregar cartão');
    }
  }

  async withDrawalCard(body) {
    try {
      await Validate.withdrawal.validateAsync(body);

      // Verficar se existe o cartão;
      const card = await CardRepository.findOne(body.card);
      if (!card) {
        throw new Error('Cartão não encontrado');
      }

      // Verficar status do cartão;
      if (card.status !== StatusCard.IN_USE) {
        throw new Error('Cartão não está em uso');
      }

      // Verificar se o depósito realizado foi Dinheiro ou Pix;
      if (
        card.deposit_type !== DepositType.PIX &&
        card.deposit_type !== DepositType.DINHEIRO
      ) {
        return {
          message: 'withdrawal_not_permision',
          balance: card.value_available,
        };
      }

      // Verifica se existe valor disponível para devolução
      if (card.value_available <= 0) {
        return {
          message: 'not_value_available',
          balance: card.value_available,
        };
      }

      // Alterar status do cartão e tratar devolução
      const valueReturn = card.value_available;
      const operationType = card.operation_type;

      operationType.push(OperationType.WITHDRAWAL);

      const payload = {
        status: StatusCard.COMPLETED,
        value_available: 0,
        return_value: valueReturn,
        operation_type: operationType,
      };

      await CashierRepository.linkCardWithPerson(card._id, payload);

      return { message: 'whithdrawal_success', balance: valueReturn };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao retirar saldo do cartão');
    }
  }

  async donationCard(body) {
    try {
      await Validate.donation.validateAsync(body);

      // Verficar se existe o cartão;
      const card = await CardRepository.findOne(body.card);
      if (!card) {
        throw new Error('Cartão não encontrado');
      }

      // Verficar status do cartão;
      if (card.status !== StatusCard.IN_USE) {
        throw new Error('Cartão não está em uso');
      }

      // Verifica se existe valor disponível para doação
      if (card.value_available <= 0) {
        return {
          message: 'not_value_available',
          balance: card.value_available,
        };
      }

      // Busca o produto doação;
      const productDonation = await ProductRepository.findOne({ name: 'Doação' })

      // gerar transação da doação realizada
      const transaction = await TransactionService.createTransaction(card._id, {
        product: String(productDonation._id),
        qtd: 0,
        value: card.value_available,
        type: TypeTransaction.DONATION
      });

      if (!transaction) {
        throw new Error('Não foi possível registrar a transação!');
      }

      // Atualizar o valor e status no cartão;
      const operationType = card.operation_type;

      operationType.push(OperationType.DONATION);

      const updateCard = {
        status: StatusCard.COMPLETED,
        value_available: 0,
        operation_type: operationType,
      }

      const donation = await CashierRepository.linkCardWithPerson(card._id, updateCard);

      return { message: 'donation_success', balance: donation.value_available };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao retirar saldo do cartão');
    }
  }
}

module.exports = new CashierService();
