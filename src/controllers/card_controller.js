const CardService = require('../services/card_service');

class CardController {
  async getCardInfo(req, res) {
    try {
      const { id } = req.params;
      const result = await CardService.getCardInfo(id);
      res.status(200).json({ status: 200, data: result });
    } catch (err) {
      if (err.message === 'card_not_found') {
        return res.status(404).json({ status: 404, message: 'Cartão não encontrado' });
      }
      res.status(400).json({ status: 400, message: 'Erro ao buscar cartão' });
    }
  }

  async generateCards(req, res) {
    try {
      const results = await CardService.generateNewVirginCards();
      res.status(200).json(results);
    } catch (err) {
      console.log('error->generateCards: ', err);
      res.status(400).json({ err: 'err_generated_cards' });
    }
  }
}

module.exports = CardController;
