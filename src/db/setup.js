const mongoose = require('mongoose');

async function setupDatabase() {
  try {
    const url = `mongodb://root:example@localhost:27017/celre?authSource=admin`;

    await mongoose.connect(url);

    console.log('Conexão com BD estabelecida.');
  } catch (error) {
    console.error('Erro ao conectar com o BD:', error);
  }
}

module.exports = { setupDatabase: setupDatabase };
