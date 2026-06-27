require('dotenv').config();

const app = require('./src/app');
const { setupDatabase } = require('./src/db/setup');

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await setupDatabase();

    app.listen(PORT, () => {
      console.log(`API Server running! ${PORT}`);
    });
  } catch (error) {
    console.error(
      'Aplicação encerrada por falha na conexão com o MongoDB Atlas.'
    );
    process.exit(1);
  }
}

startServer();
