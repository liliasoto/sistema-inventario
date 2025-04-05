const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

// Rutas para items
router.get('/', itemController.getAll);
router.get('/search', itemController.searchByName);
router.get('/type/:type', itemController.getByType);
router.get('/:id', itemController.getById);
router.post('/', itemController.create);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.delete);

module.exports = router;