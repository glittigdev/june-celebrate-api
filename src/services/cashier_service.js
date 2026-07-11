const mongoose = require('mongoose');

// Services
const TransactionService = require('../services/transaction_service');

// Repositories
const CashierRepository = require('../repositories/cashier_repository');
const PersonRepository = require('../repositories/person_repository');
const CardRepository = require('../repositories/card_repository');
const ProductRepository = require('../repositories/product_repository')
const LogDeposit = require('../repositories/log_deposit_repository');

// Validation
const Validate = require('../validation/cashier_validation');

//Enum
const { StatusCard, DepositType, OperationType, TypeTransaction } = require('../domains/enum');

class CashierService {
  async linkinCardWithUser(body) {
    try {
      await Validate.linkin.validateAsync(body);

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
        deposit_type: [DepositType.fromString(body.depositType)],
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

      await LogDeposit.createDeposit({ 
        value_deposit: body.value,
        deposit_type: DepositType.fromString(body.depositType),
        operation_type: OperationType.LINK
      })

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
      const operationType = card.operation_type;
      const depositType = card.deposit_type;


      operationType.push(OperationType.RECHARGE);
      depositType.push(DepositType.fromString(body.depositType));

      const payload = {
        value_available: card.value_available + body.value,
        operation_type: operationType,
        deposit_type: depositType,
        total_value: card.total_value + body.value,
      };

      const result = await CashierRepository.linkCardWithPerson(
        card._id,
        payload
      );

       await LogDeposit.createDeposit({ 
        value_deposit: body.value,
        deposit_type: DepositType.fromString(body.depositType),
        operation_type: OperationType.RECHARGE
      })

      return {
        data: {
          message: `Depósito realizado com sucesso! Valor disponível ${result.value_available}`,
          balance: result.value_available,
        },
        status: 201
      };
    } catch (error) {
      console.log(error);
      return { 
        data: { 
          message: error.message 
        }, 
        status: 400 
      };
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
        throw new Error('Cartão não está em uso.');
      }

      // Verifica se existe valor disponível para doação
      if (card.value_available <= 0) {
        throw new Error('Não há valor disponível para doação.');
      }

      // Busca o produto doação;
      const productDonation = await ProductRepository.findOne({ name: 'Doação' })

      const value_removed = card.value_available;

      // gerar transação da doação realizada
      const transaction = await TransactionService.createTransaction(card._id, {
        product: String(productDonation._id),
        qtd: 0,
        value: card.value_available,
        type: TypeTransaction.DONATION,
        stand: String(productDonation.stand),
        product_value: 0
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

      return {
        data: {
          message: `Doação realizado com sucesso! Valor doado: ${value_removed}`,
          balance: donation.value_available,
        },
        status: 201
      };
    } catch (error) {
      console.log(error);
      return {
        data: {
          message: error.message
        },
        status: 400
      };
    }
  }

  async transferCard(body) {
    const session = await mongoose.startSession();
    try {
      await Validate.transfer.validateAsync(body);

      if (body.originCard === body.destinationCard) {
        throw new Error('O cartão de origem e o cartão de destino devem ser diferentes.');
      }

      let originResult, destinationResult, transferValue;

      await session.withTransaction(async () => {
        const originCard = await CardRepository.findOne(body.originCard, session);
        if (!originCard) {
          throw new Error('Cartão de origem não encontrado');
        }

        const destinationCard = await CardRepository.findOne(body.destinationCard, session);
        if (!destinationCard) {
          throw new Error('Cartão de destino não encontrado');
        }

        if (originCard.status !== StatusCard.IN_USE) {
          throw new Error('Apenas cartões em uso podem realizar transferência.');
        }

        if (destinationCard.status !== StatusCard.IN_USE) {
          throw new Error('O cartão de destino precisa estar em uso.');
        }

        if (originCard.value_available <= 0) {
          throw new Error('Não há saldo disponível para transferência.');
        }

        transferValue = originCard.value_available;

        const originOperationType = originCard.operation_type || [];
        const destinationOperationType = destinationCard.operation_type || [];
        originOperationType.push(OperationType.TRANSFER);
        destinationOperationType.push(OperationType.TRANSFER);

        originResult = await CashierRepository.linkCardWithPerson(originCard._id, {
          value_available: 0,
          status: StatusCard.COMPLETED,
          operation_type: originOperationType,
        }, session);

        destinationResult = await CashierRepository.linkCardWithPerson(destinationCard._id, {
          value_available: destinationCard.value_available + transferValue,
          operation_type: destinationOperationType,
        }, session);
      });

      return {
        data: {
          message: `Transferência realizada com sucesso! Valor transferido: ${transferValue}`,
          originCard: { card: body.originCard, balance: originResult.value_available, status: originResult.status },
          destinationCard: { card: body.destinationCard, balance: destinationResult.value_available },
        },
        status: 201
      };
    } catch (error) {
      console.log(error);
      return {
        data: {
          message: error.message
        },
        status: 400
      };
    } finally {
      await session.endSession();
    }
  }
}

module.exports = new CashierService();
