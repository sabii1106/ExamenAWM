const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cancha = sequelize.define('Cancha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 22 // Jugadores estándar de fútbol
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'canchas',
  timestamps: true
});

module.exports = Cancha;
