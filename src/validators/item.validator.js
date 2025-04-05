const { body, param, query } = require('express-validator');

const validateItemCreate = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('tipo').isIn(['compra_venta', 'manufactura', 'servicio']).withMessage('El tipo debe ser compra_venta, manufactura o servicio'),
  body('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  body('precio_venta').isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo'),
  body('pertenece_inventario').isBoolean().withMessage('El campo pertenece_inventario debe ser un booleano'),
  body('es_subproducto').isBoolean().withMessage('El campo es_subproducto debe ser un booleano')
];

const validateItemUpdate = [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('tipo').isIn(['compra_venta', 'manufactura', 'servicio']).withMessage('El tipo debe ser compra_venta, manufactura o servicio'),
  body('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  body('precio_venta').isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo'),
  body('pertenece_inventario').isBoolean().withMessage('El campo pertenece_inventario debe ser un booleano'),
  body('es_subproducto').isBoolean().withMessage('El campo es_subproducto debe ser un booleano')
];

const validateItemId = [
  param('id').isInt().withMessage('El ID debe ser un número entero')
];

const validateItemSearch = [
  query('name').notEmpty().withMessage('El nombre de búsqueda es obligatorio')
];

module.exports = {
  validateItemCreate,
  validateItemUpdate,
  validateItemId,
  validateItemSearch
};