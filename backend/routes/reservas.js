const express = require('express');
const router = express.Router();
const { Reserva, Cancha } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las reservas con información de la cancha
router.get('/', async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre']
      }],
      order: [['fecha', 'ASC'], ['horaInicio', 'ASC']]
    });
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener reservas de una fecha específica
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const { fecha } = req.params;
    const reservas = await Reserva.findAll({
      where: { fecha },
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre']
      }],
      order: [['horaInicio', 'ASC']]
    });
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas por fecha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar disponibilidad
router.post('/verificar-disponibilidad', async (req, res) => {
  try {
    const { canchaId, fecha, horaInicio, horaFin } = req.body;

    const conflictos = await Reserva.findAll({
      where: {
        canchaId,
        fecha,
        estado: 'activa',
        [Op.or]: [
          {
            horaInicio: {
              [Op.between]: [horaInicio, horaFin]
            }
          },
          {
            horaFin: {
              [Op.between]: [horaInicio, horaFin]
            }
          },
          {
            [Op.and]: [
              { horaInicio: { [Op.lte]: horaInicio } },
              { horaFin: { [Op.gte]: horaFin } }
            ]
          }
        ]
      }
    });

    res.json({
      disponible: conflictos.length === 0,
      conflictos: conflictos.length
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva reserva
router.post('/', async (req, res) => {
  try {
    const { 
      grupoEstudiantil, 
      contacto, 
      telefono, 
      fecha, 
      horaInicio, 
      horaFin, 
      canchaId, 
      observaciones 
    } = req.body;

    // Validaciones básicas
    if (!grupoEstudiantil || !contacto || !fecha || !horaInicio || !horaFin || !canchaId) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: grupoEstudiantil, contacto, fecha, horaInicio, horaFin, canchaId' 
      });
    }

    // Verificar que la cancha existe
    const cancha = await Cancha.findByPk(canchaId);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    // Verificar disponibilidad
    const conflictos = await Reserva.findAll({
      where: {
        canchaId,
        fecha,
        estado: 'activa',
        [Op.or]: [
          {
            horaInicio: {
              [Op.between]: [horaInicio, horaFin]
            }
          },
          {
            horaFin: {
              [Op.between]: [horaInicio, horaFin]
            }
          },
          {
            [Op.and]: [
              { horaInicio: { [Op.lte]: horaInicio } },
              { horaFin: { [Op.gte]: horaFin } }
            ]
          }
        ]
      }
    });

    if (conflictos.length > 0) {
      return res.status(409).json({ 
        error: 'Ya existe una reserva en ese horario',
        conflictos: conflictos.length
      });
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      grupoEstudiantil,
      contacto,
      telefono,
      fecha,
      horaInicio,
      horaFin,
      canchaId,
      observaciones
    });

    // Obtener la reserva completa con datos de la cancha
    const reservaCompleta = await Reserva.findByPk(nuevaReserva.id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre']
      }]
    });

    res.status(201).json(reservaCompleta);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Cancelar reserva
router.put('/:id/cancelar', async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    res.json({ message: 'Reserva cancelada exitosamente', reserva });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener una reserva específica
router.get('/:id', async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json(reserva);
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Editar reserva
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      grupoEstudiantil, 
      contacto, 
      telefono, 
      fecha, 
      horaInicio, 
      horaFin, 
      canchaId, 
      observaciones 
    } = req.body;

    // Verificar que la reserva existe
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Validaciones básicas
    if (!grupoEstudiantil || !contacto || !fecha || !horaInicio || !horaFin || !canchaId) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: grupoEstudiantil, contacto, fecha, horaInicio, horaFin, canchaId' 
      });
    }

    // Verificar que la cancha existe
    const cancha = await Cancha.findByPk(canchaId);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    // Verificar disponibilidad (excluyendo la reserva actual)
    const conflictos = await Reserva.findAll({
      where: {
        id: { [Op.ne]: id }, // Excluir la reserva actual
        canchaId,
        fecha,
        estado: 'activa',
        [Op.or]: [
          {
            horaInicio: {
              [Op.between]: [horaInicio, horaFin]
            }
          },
          {
            horaFin: {
              [Op.between]: [horaInicio, horaFin]
            }
          },
          {
            [Op.and]: [
              { horaInicio: { [Op.lte]: horaInicio } },
              { horaFin: { [Op.gte]: horaFin } }
            ]
          }
        ]
      }
    });

    if (conflictos.length > 0) {
      return res.status(409).json({ 
        error: 'Ya existe una reserva en ese horario',
        conflictos: conflictos.length
      });
    }

    // Actualizar la reserva
    await reserva.update({
      grupoEstudiantil,
      contacto,
      telefono,
      fecha,
      horaInicio,
      horaFin,
      canchaId,
      observaciones
    });

    // Obtener la reserva actualizada con datos de la cancha
    const reservaActualizada = await Reserva.findByPk(id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre']
      }]
    });

    res.json(reservaActualizada);
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar reserva permanentemente
router.delete('/:id', async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    await reserva.destroy();
    res.json({ message: 'Reserva eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
