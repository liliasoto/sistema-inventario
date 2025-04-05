const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto-compra-venta.controller');
const { validateProductoCompraVentaCreate, validateProductoCompraVentaUpdate, validateProductoCompraVentaId } = require('../validators/producto-compra-venta.validator');
const { validate } = require('../validators');

// Rutas para productos de compra/venta
router.get('/', productoController.getAll);
router.get('/:id', validateProductoCompraVentaId, validate, productoController.getById);
router.post('/', validateProductoCompraVentaCreate, validate, productoController.create);
router.put('/:id', validateProductoCompraVentaUpdate, validate, productoController.update);
router.delete('/:id', validateProductoCompraVentaId, validate, productoController.delete);

module.exports = router;