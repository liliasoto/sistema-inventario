const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller');

// Rutas para proveedores
router.get('/', proveedorController.getAll);
router.get('/search', proveedorController.searchByName);
router.get('/:id', proveedorController.getById);
router.post('/', proveedorController.create);
router.put('/:id', proveedorController.update);
router.delete('/:id', proveedorController.delete);
router.get('/:id/productos', proveedorController.getProductosByProveedor);

module.exports = router;