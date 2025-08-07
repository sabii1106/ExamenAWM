// === IMPORTACIONES ===
// Express Router para crear rutas modulares
const express = require('express');
const router = express.Router();
// Modelos de la base de datos (Reserva y Cancha)
const { Reserva, Cancha } = require('../models');
// Operadores de Sequelize para consultas complejas (mayor que, menor que, between, etc.)
const { Op } = require('sequelize');

// === ENDPOINT: GET /api/reservas ===
// Obtiene todas las reservas con información de la cancha asociada
router.get('/', async (req, res) => {
  try {
    // Busca todas las reservas e incluye datos de la cancha relacionada
    const reservas = await Reserva.findAll({
      include: [{
        model: Cancha,           // Incluye datos del modelo Cancha
        as: 'cancha',            // Alias para la relación
        attributes: ['id', 'nombre'] // Solo trae ID y nombre de la cancha
      }],
      // Ordena primero por fecha, luego por hora de inicio
      order: [['fecha', 'ASC'], ['horaInicio', 'ASC']]
    });
    
    // Envía las reservas como respuesta JSON
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: GET /api/reservas/fecha/:fecha ===
// Obtiene todas las reservas de una fecha específica
router.get('/fecha/:fecha', async (req, res) => {
  try {
    // Extrae la fecha de los parámetros de la URL
    const { fecha } = req.params;
    
    // Busca reservas solo de esa fecha específica
    const reservas = await Reserva.findAll({
      where: { fecha },          // Filtra por fecha exacta
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre']
      }],
      order: [['horaInicio', 'ASC']] // Ordena por hora de inicio
    });
    
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas por fecha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: POST /api/reservas/verificar-disponibilidad ===
// Verifica si un horario está disponible para reservar
router.post('/verificar-disponibilidad', async (req, res) => {
  try {
    // Extrae los datos del horario a verificar
    const { canchaId, fecha, horaInicio, horaFin } = req.body;

    // Busca conflictos de horario con reservas activas
    const conflictos = await Reserva.findAll({
      where: {
        canchaId,              // Misma cancha
        fecha,                 // Misma fecha
        estado: 'activa',      // Solo reservas activas
        
        // Operador OR: busca cualquiera de estos conflictos de tiempo
        [Op.or]: [
          // CONFLICTO 1: La hora de inicio de otra reserva está dentro del nuevo horario
          {
            horaInicio: {
              [Op.between]: [horaInicio, horaFin] // horaInicio BETWEEN nuevo_inicio AND nuevo_fin
            }
          },
          // CONFLICTO 2: La hora de fin de otra reserva está dentro del nuevo horario
          {
            horaFin: {
              [Op.between]: [horaInicio, horaFin] // horaFin BETWEEN nuevo_inicio AND nuevo_fin
            }
          },
          // CONFLICTO 3: Una reserva existente cubre completamente el nuevo horario
          {
            [Op.and]: [
              { horaInicio: { [Op.lte]: horaInicio } }, // Empieza antes o igual
              { horaFin: { [Op.gte]: horaFin } }         // Termina después o igual
            ]
          }
        ]
      }
    });

    // Responde si está disponible (sin conflictos) y cuenta de conflictos
    res.json({
      disponible: conflictos.length === 0,
      conflictos: conflictos.length
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: POST /api/reservas ===
// Crea una nueva reserva después de verificar disponibilidad
router.post('/', async (req, res) => {
  try {
    // Extrae todos los datos necesarios para la reserva
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

    // === VALIDACIÓN 1: Campos obligatorios ===
    if (!grupoEstudiantil || !contacto || !fecha || !horaInicio || !horaFin || !canchaId) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: grupoEstudiantil, contacto, fecha, horaInicio, horaFin, canchaId' 
      });
    }

    // === VALIDACIÓN 2: Verificar que la cancha existe ===
    const cancha = await Cancha.findByPk(canchaId);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    // === VALIDACIÓN 3: Verificar disponibilidad de horario ===
    // Usa la misma lógica de verificación que el endpoint anterior
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

    // Si hay conflictos, no permite crear la reserva
    if (conflictos.length > 0) {
      return res.status(409).json({ 
        error: 'Ya existe una reserva en ese horario',
        conflictos: conflictos.length
      });
    }

    // === CREACIÓN DE LA RESERVA ===
    // Si pasa todas las validaciones, crea la nueva reserva
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

    // === RESPUESTA COMPLETA ===
    // Obtiene la reserva recién creada con datos de la cancha incluidos
    const reservaCompleta = await Reserva.findByPk(nuevaReserva.id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre']
      }]
    });

    // Envía la reserva creada con código 201 (Created)
    res.status(201).json(reservaCompleta);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: PUT /api/reservas/:id/cancelar ===
// Cambia el estado de una reserva a 'cancelada' (soft delete)
router.put('/:id/cancelar', async (req, res) => {
  try {
    // Busca la reserva por ID
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Cambia el estado a cancelada (no la elimina de la BD)
    reserva.estado = 'cancelada';
    await reserva.save();

    res.json({ message: 'Reserva cancelada exitosamente', reserva });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: GET /api/reservas/:id ===
// Obtiene los detalles completos de una reserva específica
router.get('/:id', async (req, res) => {
  try {
    // Busca la reserva con datos de la cancha incluidos
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [{
        model: Cancha,
        as: 'cancha',
        attributes: ['id', 'nombre', 'descripcion'] // Incluye descripción para más detalles
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

// === ENDPOINT: PUT /api/reservas/:id ===
// Edita una reserva existente con validaciones completas
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

    // === VALIDACIÓN 1: Verificar que la reserva existe ===
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // === VALIDACIÓN 2: Campos obligatorios ===
    if (!grupoEstudiantil || !contacto || !fecha || !horaInicio || !horaFin || !canchaId) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: grupoEstudiantil, contacto, fecha, horaInicio, horaFin, canchaId' 
      });
    }

    // === VALIDACIÓN 3: Verificar que la cancha existe ===
    const cancha = await Cancha.findByPk(canchaId);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    // === VALIDACIÓN 4: Verificar disponibilidad (excluyendo la reserva actual) ===
    // Similar a la creación, pero excluye la reserva que se está editando
    const conflictos = await Reserva.findAll({
      where: {
        id: { [Op.ne]: id }, // Op.ne = "not equal" - excluye la reserva actual
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

    // === ACTUALIZACIÓN ===
    // Si pasa todas las validaciones, actualiza la reserva
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

    // === RESPUESTA ===
    // Obtiene la reserva actualizada con datos de la cancha
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

// === ENDPOINT: DELETE /api/reservas/:id ===
// Elimina permanentemente una reserva de la base de datos (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    // Busca la reserva por ID
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Elimina la reserva permanentemente de la base de datos
    await reserva.destroy();
    res.json({ message: 'Reserva eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === EXPORTACIÓN ===
// Exporta todas las rutas para que server.js pueda usarlas
module.exports = router;
