const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const routers = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routers);

// Rotas
require('./routes/cashier_routes')(routers);
require('./routes/card_routes')(routers);
require('./routes/stand_routes')(routers);
require('./routes/product_routes')(routers);
require('./routes/consumo_routes')(routers);

module.exports = app;
