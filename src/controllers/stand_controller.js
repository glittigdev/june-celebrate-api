const StandService = require('../services/stand_service');

class StandController {
  async createStand(req, res) {
    try {
      const body = req.body;
      const results = await StandService.createStand(body);
      res.status(200).json(results);
    } catch (err) {
      console.log('error->createStand: ', err);
      res.status(400).json({ err: 'err_to_create_stand' });
    }
  }

  async takeCardInformation(req, res) {
    try {
      const { id } = req.query;
      console.log(id)
      const results = await StandService.takeCardInformationToSeling(id);
      res.status(200).json(results);
    } catch (err) {
      console.log('error->takeCardInformation: ', err);
      res.status(400).json({ err: 'err_take_info_card' });
    }
  }

  async selingProduct(req, res) {
    try {
      const { id } = req.query;
      const  body = req.body;
      const results = await StandService.registerSale(id, body);
      res.status(200).json(results);
    } catch (err) {
      console.log('error->registerSale: ', err);
      res.status(400).json({ err: 'err_register_sale' });
    }
  }

  async takeStands(req, res) {
    try {
      const results = await StandService.takeStands();
      res.status(200).json(results);
    } catch (err) {
      console.log('error->takeStands: ', err);
      res.status(400).json({ err: 'err_get_stands' });
    }
  }

  async standLogin(req, res) {
    try {
      const body = req.body;
      console.log('body');
      // const results = await StandService.registerSale(id, body);
      res.status(200).json('results');
    } catch (err) {
      console.log('error->registerSale: ', err);
      res.status(400).json({ err: 'err_register_sale' });
    }
  }
}

module.exports = StandController;
