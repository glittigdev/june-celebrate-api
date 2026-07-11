const CashierService = require('../services/cashier_service');
const BaseController = require('../base/base_controller');

class CashierController extends BaseController {
  async createLinkCard(req, res) {
    try {
      const body = req.body;
      const results = await CashierService.linkinCardWithUser(body);
      const response = this.middlewareResponse(results.status, 'linkin_user_success', results.data)
      res.json(response);
    } catch (err) {
      console.log('error->linkCard: ', err.message);
      let error = this.errorReponse(err);
      const response = this.middlewareResponse(400, err.message, {}, err.debugMessage)
      res.json(response);
    }
  }

  async rechargeCard(req, res) {
    try {
      const body = req.body;
      const results = await CashierService.rechargeCard(body);
      res.status(201).json(results);
    } catch (err) {
      console.log('error->linkCard: ', err);
      res.status(400).json({ err: 'err_recharge_card' });
    }
  }

  async withdrawalCard(req, res) {
    try {
      const body = req.body;
      const results = await CashierService.withDrawalCard(body);
      res.status(201).json(results);
    } catch (err) {
      console.log('error->withdrawalCard: ', err);
      res.status(400).json({ err: 'err_withdrawal_card' });
    }
  }

  async donationCard(req, res) {
    try {
      const body = req.body;
      const results = await CashierService.donationCard(body);
      res.status(201).json(results);
    } catch (err) {
      console.log('error->donationCard: ', err);
      res.status(400).json({ err: 'err_donation_card' });
    }
  }

  async transferCard(req, res) {
    try {
      const body = req.body;
      const results = await CashierService.transferCard(body);
      res.status(results.status).json(results);
    } catch (err) {
      console.log('error->transferCard: ', err);
      res.status(400).json({ err: 'err_transfer_card' });
    }
  }
}

module.exports = CashierController;
