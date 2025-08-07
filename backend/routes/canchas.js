const express = require('express');
const router = express.Router();
const { Cancha } = require('../models');

// Obtener todas las canchas activas
router.get('/', async (req, res) => {
  try {
    const canchas = await Cancha.findAll({
      where: { activa: true },
      order: [['nombre', 'ASC']]
    });
    res.json(canchas);
  } catch (error) {
    console.error('Error al obtener canchas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener una cancha específica
router.get('/:id', async (req, res) => {
  try {
    const cancha = await Cancha.findByPk(req.params.id);
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    res.json(cancha);
  } catch (error) {
    console.error('Error al obtener cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva cancha
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, capacidad } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const nuevaCancha = await Cancha.create({
      nombre,
      descripcion,
      capacidad: capacidad || 22
    });

    res.status(201).json(nuevaCancha);
  } catch (error) {
    console.error('Error al crear cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
