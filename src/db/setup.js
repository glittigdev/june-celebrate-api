const mongoose = require('mongoose');

async function setupDatabase() {
  try {
    const url = `mongodb+srv://littigdev:kxbBPUDXTLIgwBCO@cluster0.d4qimkq.mongodb.net/celre`;

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoose.connect(url);

    console.log('Conexão com BD estabelecida.');
  } catch (error) {
    console.error('Erro ao conectar com o BD:', error);
  }
}

module.exports = { setupDatabase: setupDatabase };
