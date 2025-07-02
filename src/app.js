const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const setup = require('./db/setup');

const app = express();
const routers = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routers);

// Conecta com o banco
(async () => {
  try {
    console.log('Conectando ao mongo...');
    await setup.setupDatabase();
  } catch (error) {
    console.error('Falha ao conectar a base:', error);
  }
})();

// Rotas
require('./routes/cashier_routes')(routers);
require('./routes/card_routes')(routers);
require('./routes/stand_routes')(routers);
require('./routes/product_routes')(routers);

module.exports = app;
