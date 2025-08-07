// Importamos DataTypes de Sequelize para definir tipos de datos de las columnas
const { DataTypes } = require('sequelize');
// Importamos la instancia de sequelize configurada para conectar con la base de datos
const sequelize = require('../config/database');

// === DEFINICIÓN DEL MODELO CANCHA ===
// Un modelo en Sequelize representa una tabla en la base de datos
const Cancha = sequelize.define('Cancha', {
  // === COLUMNA ID ===
  // Clave primaria que identifica únicamente cada cancha
  id: {
    type: DataTypes.INTEGER,     // Tipo entero (1, 2, 3, etc.)
    primaryKey: true,            // Marca esta columna como clave primaria
    autoIncrement: true          // Se incrementa automáticamente (1, 2, 3...)
  },
  
  // === COLUMNA NOMBRE ===
  // Nombre descriptivo de la cancha (ej: "Cancha 1", "Cancha Principal")
  nombre: {
    type: DataTypes.STRING(100), // Texto de máximo 100 caracteres
    allowNull: false             // Campo obligatorio (no puede estar vacío)
  },
  
  // === COLUMNA DESCRIPCION ===
  // Descripción detallada de la cancha (características, ubicación, etc.)
  descripcion: {
    type: DataTypes.TEXT,        // Texto largo sin límite específico
    allowNull: true              // Campo opcional (puede estar vacío)
  },
  
  // === COLUMNA CAPACIDAD ===
  // Número de jugadores que pueden usar la cancha simultáneamente
  capacidad: {
    type: DataTypes.INTEGER,     // Número entero
    allowNull: false,            // Campo obligatorio
    defaultValue: 22             // Valor por defecto: 22 jugadores (11 por equipo en fútbol)
  },
  
  // === COLUMNA ACTIVA ===
  // Indica si la cancha está disponible para reservas o está fuera de servicio
  activa: {
    type: DataTypes.BOOLEAN,     // Valor verdadero/falso
    defaultValue: true           // Por defecto las canchas están activas
  }
}, {
  // === CONFIGURACIÓN DE LA TABLA ===
  tableName: 'canchas',         // Nombre exacto de la tabla en MySQL
  timestamps: true              // Agrega automáticamente createdAt y updatedAt
});

// === EXPORTACIÓN DEL MODELO ===
// Permite que otros archivos importen y usen este modelo
// Ejemplo: const { Cancha } = require('./models/Cancha');
module.exports = Cancha;
