const StatusCard = Object.freeze({
  VIRGIN: 'Virgem',
  IN_USE: 'Em uso',
  COMPLETED: 'Encerrado',

  fromString: function (status) {
    return Object.keys(StatusCard).includes(status) ? StatusCard[status] : null;
  },
});

const DepositType = Object.freeze({
  PIX: 'Pix',
  DEBITO: 'Débito',
  CREDITO: 'Credito',
  DINHEIRO: 'Dinheiro',

  fromString: function (status) {
    return Object.keys(DepositType).includes(status)
      ? DepositType[status]
      : null;
  },
});

const OperationType = Object.freeze({
  LINK: 'Vínculo',
  RECHARGE: 'Recarga',
  WITHDRAWAL: 'Retirada',
  DONATION: 'Doação',

  fromString: function (status) {
    return Object.keys(OperationType).includes(status)
      ? OperationType[status]
      : null;
  },
});

const TypeTransaction = Object.freeze({
  DONATION: 'Doação',
  PRODUCT: 'Produto',

  fromString: function (status) {
    return Object.keys(TypeTransaction).includes(status)
      ? TypeTransaction[status]
      : null;
  },
});

module.exports = { StatusCard, OperationType, DepositType, TypeTransaction };
