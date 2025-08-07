// Importamos DataTypes de Sequelize para definir tipos de datos de las columnas
const { DataTypes } = require('sequelize');
// Importamos la instancia de sequelize configurada para conectar con la base de datos
const sequelize = require('../config/database');

// === DEFINICIÓN DEL MODELO RESERVA ===
// Representa las reservas de canchas hechas por grupos estudiantiles
const Reserva = sequelize.define('Reserva', {
  // === COLUMNA ID ===
  // Identificador único de cada reserva
  id: {
    type: DataTypes.INTEGER,     // Número entero
    primaryKey: true,            // Clave primaria de la tabla
    autoIncrement: true          // Se incrementa automáticamente
  },
  
  // === COLUMNA GRUPO ESTUDIANTIL ===
  // Nombre del grupo estudiantil que hace la reserva
  grupoEstudiantil: {
    type: DataTypes.STRING(150), // Texto de máximo 150 caracteres
    allowNull: false             // Campo obligatorio
    // Ejemplos: "Grupo de Ingeniería", "Club de Fútbol Medicina"
  },
  
  // === COLUMNA CONTACTO ===
  // Nombre de la persona responsable de la reserva
  contacto: {
    type: DataTypes.STRING(100), // Texto de máximo 100 caracteres
    allowNull: false             // Campo obligatorio
    // Ejemplo: "Juan Pérez", "María González"
  },
  
  // === COLUMNA TELEFONO ===
  // Número de teléfono para comunicarse en caso de cambios o problemas
  telefono: {
    type: DataTypes.STRING(20),  // Texto de máximo 20 caracteres
    allowNull: true              // Campo opcional
    // Ejemplo: "+503 1234-5678", "7890-1234"
  },
  
  // === COLUMNA FECHA ===
  // Día en que se usará la cancha
  fecha: {
    type: DataTypes.DATEONLY,    // Solo fecha (YYYY-MM-DD), sin hora
    allowNull: false             // Campo obligatorio
    // Ejemplo: "2024-03-15"
  },
  
  // === COLUMNA HORA INICIO ===
  // Hora en que comienza la reserva
  horaInicio: {
    type: DataTypes.TIME,        // Solo hora (HH:MM:SS)
    allowNull: false             // Campo obligatorio
    // Ejemplo: "14:00:00" (2:00 PM)
  },
  
  // === COLUMNA HORA FIN ===
  // Hora en que termina la reserva
  horaFin: {
    type: DataTypes.TIME,        // Solo hora (HH:MM:SS)
    allowNull: false             // Campo obligatorio
    // Ejemplo: "16:00:00" (4:00 PM)
  },
  
  // === COLUMNA CANCHA ID ===
  // Referencia a qué cancha se está reservando (Foreign Key)
  canchaId: {
    type: DataTypes.INTEGER,     // Número entero
    allowNull: false,            // Campo obligatorio
    references: {                // Define la relación con otra tabla
      model: 'canchas',          // Tabla referenciada
      key: 'id'                  // Columna referenciada (id de canchas)
    }
    // Esto crea una relación: cada reserva pertenece a una cancha específica
  },
  
  // === COLUMNA ESTADO ===
  // Estado actual de la reserva
  estado: {
    type: DataTypes.ENUM('activa', 'cancelada', 'completada'), // Solo estos valores permitidos
    defaultValue: 'activa'       // Por defecto las reservas están activas
    // 'activa' = reserva confirmada y vigente
    // 'cancelada' = reserva cancelada por el grupo
    // 'completada' = reserva que ya se realizó
  },
  
  // === COLUMNA OBSERVACIONES ===
  // Comentarios adicionales sobre la reserva
  observaciones: {
    type: DataTypes.TEXT,        // Texto largo
    allowNull: true              // Campo opcional
    // Ejemplo: "Necesitamos balones", "Entrenamiento especial"
  }
}, {
  // === CONFIGURACIÓN DE LA TABLA ===
  tableName: 'reservas',         // Nombre exacto de la tabla en MySQL
  timestamps: true               // Agrega createdAt y updatedAt automáticamente
});

// === EXPORTACIÓN DEL MODELO ===
// Permite usar este modelo en otros archivos
module.exports = Reserva;
