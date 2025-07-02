const CardService = require('../services/card_service');

class CardController {
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
