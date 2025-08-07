const { Sequelize } = require('sequelize');

// Crear conexión inicial sin especificar base de datos para crearla si no existe
const createDatabaseIfNotExists = async () => {
  const sequelizeTemp = new Sequelize(
    '', // Sin base de datos específica
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'root',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false
    }
  );

  try {
    await sequelizeTemp.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'reservas_canchas'}\``);
    console.log('Base de datos verificada/creada exitosamente');
  } catch (error) {
    console.error('Error al crear la base de datos:', error);
  } finally {
    await sequelizeTemp.close();
  }
};

// Crear la conexión principal
const sequelize = new Sequelize(
  process.env.DB_NAME || 'reservas_canchas',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Cambiar a true para ver queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  await createDatabaseIfNotExists();
  return sequelize;
};

module.exports = sequelize;
module.exports.initializeDatabase = initializeDatabase;
