const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { validateItemCreate, validateItemUpdate, validateItemId, validateItemSearch } = require('../validators/item.validator');
const { validate } = require('../validators');

// Rutas para items
router.get('/', itemController.getAll);
router.get('/search', validateItemSearch, validate, itemController.searchByName);
router.get('/type/:type', itemController.getByType);
router.get('/:id', validateItemId, validate, itemController.getById);
router.post('/', validateItemCreate, validate, itemController.create);
router.put('/:id', validateItemUpdate, validate, itemController.update);
router.delete('/:id', validateItemId, validate, itemController.delete);

module.exports = router;