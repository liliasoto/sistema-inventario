const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicio.controller');

// Rutas para servicios
router.get('/', servicioController.getAll);
router.get('/:id', servicioController.getById);
router.post('/', servicioController.create);
router.put('/:id', servicioController.update);
router.delete('/:id', servicioController.delete);

module.exports = router;