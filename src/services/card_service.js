const CardRepository = require('../repositories/card_repository');
const StatusCard = require('../domains/enum');

class CardService {
  async generateNewVirginCards() {
    try {
      console.log('Iniciando geração de cards...');
      const cards = [];

      for (let i = 1; i <= 350; i++) {
        console.log('Card::', i);
        const cardNumber = this.padNumber(i, 3); // Gera '001', '002', ..., '200'
        cards.push({
          card: cardNumber,
          status: StatusCard.VIRGIN,
          value_available: 0,
        });
      }

      console.log('Salvando Cards...');
      const insertedCards = await CardRepository.insertManyCards(cards);
      console.log('Cards cadastrados com sucesso');

      // Atualiza o campo url_qrCode com base no _id
      const updatePromises = insertedCards.map((card) => {
        const qrUrl = `https://d10pefzne7xozt.cloudfront.net/barraca?id=${card._id}`;
        return CardRepository.findCardAndInsertURL(card._id, {
          url_qrCode: qrUrl,
        });
      });

      await Promise.all(updatePromises);

      console.log('Finalizado..');
      return { message: 'generate_card_success' };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao gerar Cards');
    }
  }

  padNumber(num, size) {
    return num.toString().padStart(size, '0');
  }
}

module.exports = new CardService();
