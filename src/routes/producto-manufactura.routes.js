const express = require('express');
const router = express.Router();
const productoManufacturaController = require('../controllers/producto-manufactura.controller');

// Rutas para productos de manufactura
router.get('/', productoManufacturaController.getAll);
router.get('/:id', productoManufacturaController.getById);
router.post('/', productoManufacturaController.create);
router.put('/:id', productoManufacturaController.update);
router.delete('/:id', productoManufacturaController.delete);
router.get('/:id/materiales', productoManufacturaController.getMateriales);

module.exports = router;