const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/database');
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
  res.json({ message: 'API funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;

// Sincronizar base de datos y iniciar servidor
db.sync({ force: false }) // Cambiar a true solo en desarrollo para recrear tablas
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar base de datos:', err);
  });
