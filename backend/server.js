// === IMPORTACIONES DE DEPENDENCIAS ===
// Express.js - Framework web para Node.js que facilita crear APIs REST
const express = require('express');
// CORS - Permite que el frontend (React en puerto 3000) se comunique con backend (puerto 5000)
const cors = require('cors');
// Body Parser - Middleware para procesar datos JSON y formularios en las peticiones HTTP
const bodyParser = require('body-parser');
// Dotenv - Carga variables de entorno desde archivo .env para configuración segura
require('dotenv').config();

// === IMPORTACIONES LOCALES ===
// Configuración de base de datos - importa la instancia de Sequelize configurada
const db = require('./config/database');
// Función para inicializar la base de datos - crea la BD si no existe
const { initializeDatabase } = require('./config/database');
// Rutas de reservas - contiene todos los endpoints relacionados con reservas (CRUD)
const reservasRoutes = require('./routes/reservas');
// Rutas de canchas - contiene todos los endpoints relacionados con canchas (CRUD)
const canchasRoutes = require('./routes/canchas');

// === CREACIÓN DE LA APLICACIÓN EXPRESS ===
// Inicializa una nueva aplicación Express.js
const app = express();

// === CONFIGURACIÓN DE MIDDLEWARES ===
// Los middlewares son funciones que procesan las peticiones HTTP antes de llegar a las rutas

// CORS: Permite peticiones desde diferentes orígenes (frontend React → backend Express)
app.use(cors());
// Body Parser JSON: Convierte el cuerpo de peticiones JSON en objetos JavaScript
app.use(bodyParser.json());
// Body Parser URL-encoded: Procesa formularios HTML estándar
app.use(bodyParser.urlencoded({ extended: true }));

// === CONFIGURACIÓN DE RUTAS ===
// Monta las rutas de reservas en el path /api/reservas
// Ejemplo: GET /api/reservas/1 → routes/reservas.js maneja la petición
app.use('/api/reservas', reservasRoutes);
// Monta las rutas de canchas en el path /api/canchas
// Ejemplo: GET /api/canchas → routes/canchas.js maneja la petición
app.use('/api/canchas', canchasRoutes);

// === RUTA DE PRUEBA ===
// Endpoint simple para verificar que la API está funcionando
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString() // Incluye fecha/hora actual en formato ISO
  });
});

// === RUTA PARA INICIALIZAR DATOS DE PRUEBA ===
// Endpoint POST que crea las 4 canchas iniciales si no existen
app.post('/api/init-data', async (req, res) => {
  try {
    // Importa el modelo Cancha para hacer operaciones en la base de datos
    const { Cancha } = require('./models');
    
    // Verifica si ya existen canchas en la base de datos
    const canchasCount = await Cancha.count();
    
    // Si no hay canchas, crea las 4 canchas de fútbol por defecto
    if (canchasCount === 0) {
      // bulkCreate: Inserta múltiples registros en una sola operación (más eficiente)
      await Cancha.bulkCreate([
        {
          nombre: 'Cancha 1',
          descripcion: 'Sector 1 - Cancha de fútbol con césped natural',
          capacidad: 22 // 11 jugadores por equipo
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
    
    // Respuesta exitosa confirmando que los datos se inicializaron
    res.json({ message: 'Datos inicializados correctamente' });
  } catch (error) {
    // Si hay error, lo registra en consola y envía respuesta de error al cliente
    console.error('Error al inicializar datos:', error);
    res.status(500).json({ error: 'Error al inicializar datos' });
  }
});

// === CONFIGURACIÓN DEL PUERTO ===
// Usa variable de entorno PORT o puerto 5000 por defecto
const PORT = process.env.PORT || 5000;

// === FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ===
// Función asíncrona que inicializa todo el sistema en orden correcto
const startServer = async () => {
  try {
    // PASO 1: Inicializar base de datos (crear BD si no existe)
    await initializeDatabase();
    console.log('Base de datos inicializada');
    
    // PASO 2: Sincronizar modelos (crear/actualizar tablas según los modelos)
    // force: false = no recrear tablas existentes (cambiar a true solo en desarrollo)
    await db.sync({ force: false });
    console.log('Modelos sincronizados');
    
    // PASO 3: Iniciar el servidor HTTP y escuchar en el puerto especificado
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`API disponible en: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    // Si hay cualquier error durante la inicialización, termina el proceso
    console.error('Error al inicializar la aplicación:', err);
    process.exit(1); // Código 1 = error, termina el proceso de Node.js
  }
};

// === ARRANQUE DE LA APLICACIÓN ===
// Ejecuta la función de inicialización para arrancar todo el sistema
startServer();
