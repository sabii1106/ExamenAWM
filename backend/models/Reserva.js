const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  grupoEstudiantil: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  horaFin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  canchaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'canchas',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('activa', 'cancelada', 'completada'),
    defaultValue: 'activa'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reservas',
  timestamps: true
});

module.exports = Reserva;
