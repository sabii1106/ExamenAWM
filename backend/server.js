const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/database');
const { initializeDatabase } = require('./config/database');
const reservasRoutes = require('./routes/reservas');
const canchasRoutes = require('./routes/canchas');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/reservas', reservasRoutes);
app.use('/api/canchas', canchasRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta para inicializar datos de prueba
app.post('/api/init-data', async (req, res) => {
  try {
    const { Cancha } = require('./models');
    
    // Crear canchas de ejemplo si no existen
    const canchasCount = await Cancha.count();
    if (canchasCount === 0) {
      await Cancha.bulkCreate([
        {
          nombre: 'Cancha 1',
          descripcion: 'Sector 1 - Cancha de fútbol con césped natural',
          capacidad: 22
        },
        {
          nombre: 'Cancha 2',
          descripcion: 'Sector 2 - Cancha de fútbol con césped sintético',
          capacidad: 22
        },
        {
          nombre: 'Cancha 3',
          descripcion: 'Sector 3 - Cancha de fútbol mixta',
          capacidad: 22
        },
        {
          nombre: 'Cancha 4',
          descripcion: 'Sector 4 - Cancha de fútbol para entrenamientos',
          capacidad: 22
        }
      ]);
    }
    
    res.json({ message: 'Datos inicializados correctamente' });
  } catch (error) {
    console.error('Error al inicializar datos:', error);
    res.status(500).json({ error: 'Error al inicializar datos' });
  }
});

const PORT = process.env.PORT || 5000;

// Función principal para inicializar todo
const startServer = async () => {
  try {
    // Inicializar base de datos (crear si no existe)
    await initializeDatabase();
    console.log('Base de datos inicializada');
    
    // Sincronizar modelos
    await db.sync({ force: false }); // Cambiar a true solo en desarrollo para recrear tablas
    console.log('Modelos sincronizados');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`API disponible en: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Error al inicializar la aplicación:', err);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();
