const express = require('express');
const router = express.Router();
const materialManufacturaController = require('../controllers/material-manufactura.controller');

// Rutas para materiales de manufactura
router.get('/', materialManufacturaController.getAll);
router.get('/:id', materialManufacturaController.getById);
router.post('/', materialManufacturaController.create);
router.put('/:id', materialManufacturaController.update);
router.delete('/:id', materialManufacturaController.delete);
router.get('/producto/:productoId', materialManufacturaController.getByProductoId);

module.exports = router;