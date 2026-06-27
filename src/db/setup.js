const mongoose = require('mongoose');

async function setupDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const error = new Error(
      'Variável de ambiente MONGO_URI não definida. Configure o acesso ao MongoDB Atlas no arquivo .env.'
    );

    console.error('Erro de configuração do banco:', error.message);
    throw error;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || 'cele',
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Conexão com MongoDB Atlas estabelecida.');
    return mongoose.connection;
  } catch (error) {
    console.error(
      'Falha ao conectar ao MongoDB Atlas. Verifique a MONGO_URI, as credenciais, a whitelist de IP e o status do cluster.'
    );
    console.error('Detalhe técnico da conexão:', error.message);
    throw error;
  }
}

module.exports = { setupDatabase: setupDatabase };
