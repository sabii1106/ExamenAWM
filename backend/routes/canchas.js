// === IMPORTACIONES ===
// Express Router - permite crear rutas modulares
const express = require('express');
// Crea una instancia de router para definir rutas específicas de canchas
const router = express.Router();
// Importa el modelo Cancha para hacer operaciones en la base de datos
const { Cancha } = require('../models');

// === ENDPOINT: GET /api/canchas ===
// Obtiene todas las canchas activas del sistema
router.get('/', async (req, res) => {
  try {
    // Busca todas las canchas que están activas (activa = true)
    const canchas = await Cancha.findAll({
      where: { activa: true },     // Solo canchas activas
      order: [['nombre', 'ASC']]   // Ordenadas alfabéticamente por nombre
    });
    
    // Envía las canchas como respuesta JSON
    res.json(canchas);
  } catch (error) {
    // Si hay error, lo registra y envía mensaje de error
    console.error('Error al obtener canchas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: GET /api/canchas/:id ===
// Obtiene una cancha específica por su ID
router.get('/:id', async (req, res) => {
  try {
    // Busca la cancha por su clave primaria (ID)
    const cancha = await Cancha.findByPk(req.params.id);
    
    // Si no encuentra la cancha, envía error 404
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    
    // Si la encuentra, envía los datos de la cancha
    res.json(cancha);
  } catch (error) {
    // Manejo de errores del servidor
    console.error('Error al obtener cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: POST /api/canchas ===
// Crea una nueva cancha en el sistema
router.post('/', async (req, res) => {
  try {
    // Extrae los datos del cuerpo de la petición
    const { nombre, descripcion, capacidad } = req.body;
    
    // Validación: el nombre es obligatorio
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    // Validación: verificar que no exista una cancha con el mismo nombre
    const canchaExistente = await Cancha.findOne({
      where: { nombre }
    });
    
    if (canchaExistente) {
      return res.status(409).json({ error: 'Ya existe una cancha con ese nombre' });
    }

    // Crea la nueva cancha en la base de datos
    const nuevaCancha = await Cancha.create({
      nombre,
      descripcion,
      capacidad: capacidad || 22 // Si no se especifica capacidad, usa 22 por defecto
    });

    // Envía la cancha creada con código 201 (Created)
    res.status(201).json(nuevaCancha);
  } catch (error) {
    // Manejo de errores durante la creación
    console.error('Error al crear cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: PUT /api/canchas/:id ===
// Edita una cancha existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, capacidad, activa } = req.body;
    
    // === VALIDACIÓN 1: Verificar que la cancha existe ===
    const cancha = await Cancha.findByPk(id);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    
    // === VALIDACIÓN 2: El nombre es obligatorio ===
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    // === VALIDACIÓN 3: Verificar que no exista otra cancha con el mismo nombre ===
    const canchaExistente = await Cancha.findOne({
      where: { 
        nombre,
        id: { [require('sequelize').Op.ne]: id } // Excluir la cancha actual
      }
    });
    
    if (canchaExistente) {
      return res.status(409).json({ error: 'Ya existe otra cancha con ese nombre' });
    }
    
    // === ACTUALIZACIÓN ===
    // Actualiza la cancha con los nuevos datos
    await cancha.update({
      nombre,
      descripcion,
      capacidad: capacidad || cancha.capacidad, // Mantiene capacidad actual si no se especifica
      activa: activa !== undefined ? activa : cancha.activa // Mantiene estado actual si no se especifica
    });
    
    // Envía la cancha actualizada
    res.json(cancha);
  } catch (error) {
    console.error('Error al actualizar cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: PUT /api/canchas/:id/desactivar ===
// Desactiva una cancha (soft delete - no elimina físicamente)
router.put('/:id/desactivar', async (req, res) => {
  try {
    // Busca la cancha por ID
    const cancha = await Cancha.findByPk(req.params.id);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    
    // Verifica si ya está desactivada
    if (!cancha.activa) {
      return res.status(400).json({ error: 'La cancha ya está desactivada' });
    }
    
    // === VALIDACIÓN: Verificar si tiene reservas activas ===
    const { Reserva } = require('../models');
    const reservasActivas = await Reserva.count({
      where: {
        canchaId: req.params.id,
        estado: 'activa',
        fecha: {
          [require('sequelize').Op.gte]: new Date() // Fecha mayor o igual a hoy
        }
      }
    });
    
    if (reservasActivas > 0) {
      return res.status(409).json({ 
        error: `No se puede desactivar la cancha. Tiene ${reservasActivas} reserva(s) activa(s) pendiente(s).`,
        reservasActivas
      });
    }
    
    // Desactiva la cancha
    cancha.activa = false;
    await cancha.save();
    
    res.json({ 
      message: 'Cancha desactivada exitosamente',
      cancha 
    });
  } catch (error) {
    console.error('Error al desactivar cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: PUT /api/canchas/:id/activar ===
// Reactiva una cancha desactivada
router.put('/:id/activar', async (req, res) => {
  try {
    // Busca la cancha por ID
    const cancha = await Cancha.findByPk(req.params.id);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    
    // Verifica si ya está activada
    if (cancha.activa) {
      return res.status(400).json({ error: 'La cancha ya está activada' });
    }
    
    // Reactiva la cancha
    cancha.activa = true;
    await cancha.save();
    
    res.json({ 
      message: 'Cancha activada exitosamente',
      cancha 
    });
  } catch (error) {
    console.error('Error al activar cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: DELETE /api/canchas/:id ===
// Elimina permanentemente una cancha (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    // Busca la cancha por ID
    const cancha = await Cancha.findByPk(req.params.id);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    
    // === VALIDACIÓN: Verificar si tiene reservas asociadas ===
    const { Reserva } = require('../models');
    const reservasCount = await Reserva.count({
      where: { canchaId: req.params.id }
    });
    
    if (reservasCount > 0) {
      return res.status(409).json({ 
        error: `No se puede eliminar la cancha. Tiene ${reservasCount} reserva(s) asociada(s). Use desactivar en su lugar.`,
        reservasAsociadas: reservasCount,
        sugerencia: 'Usa PUT /api/canchas/:id/desactivar para desactivar sin eliminar'
      });
    }
    
    // Si no tiene reservas, elimina la cancha permanentemente
    await cancha.destroy();
    
    res.json({ 
      message: 'Cancha eliminada exitosamente',
      canchaEliminada: {
        id: cancha.id,
        nombre: cancha.nombre
      }
    });
  } catch (error) {
    console.error('Error al eliminar cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === ENDPOINT: GET /api/canchas/estadisticas ===
// Obtiene estadísticas de uso de canchas
router.get('/estadisticas/uso', async (req, res) => {
  try {
    const { Reserva } = require('../models');
    const { Op } = require('sequelize');
    
    // Obtiene estadísticas de cada cancha
    const estadisticas = await Cancha.findAll({
      attributes: [
        'id',
        'nombre',
        'capacidad',
        'activa',
        // Cuenta total de reservas
        [require('sequelize').fn('COUNT', require('sequelize').col('Reservas.id')), 'totalReservas'],
        // Cuenta reservas activas
        [require('sequelize').fn('SUM', 
          require('sequelize').literal("CASE WHEN Reservas.estado = 'activa' THEN 1 ELSE 0 END")
        ), 'reservasActivas']
      ],
      include: [{
        model: Reserva,
        attributes: [], // No necesitamos los datos de reservas, solo el conteo
        required: false // LEFT JOIN para incluir canchas sin reservas
      }],
      group: ['Cancha.id'],
      order: [['nombre', 'ASC']]
    });
    
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// === EXPORTACIÓN ===
// Exporta el router para que server.js pueda usar estas rutas
module.exports = router;
