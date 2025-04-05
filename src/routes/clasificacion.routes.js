const express = require('express');
const router = express.Router();
const clasificacionController = require('../controllers/clasificacion.controller');

// Rutas para clasificaciones
router.get('/', clasificacionController.getAll);
router.get('/:id', clasificacionController.getById);
router.post('/', clasificacionController.create);
router.put('/:id', clasificacionController.update);
router.delete('/:id', clasificacionController.delete);
router.get('/:id/productos', clasificacionController.getProductosByClasificacion);

module.exports = router;