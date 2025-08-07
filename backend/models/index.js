const Cancha = require('./Cancha');
const Reserva = require('./Reserva');

// Definir relaciones
Cancha.hasMany(Reserva, { foreignKey: 'canchaId', as: 'reservas' });
Reserva.belongsTo(Cancha, { foreignKey: 'canchaId', as: 'cancha' });

module.exports = {
  Cancha,
  Reserva
};
