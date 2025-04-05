const { body, param } = require('express-validator');

const validateProductoCompraVentaCreate = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  body('descripcion_compra').notEmpty().withMessage('La descripción de compra es obligatoria'),
  body('descripcion_venta').notEmpty().withMessage('La descripción de venta es obligatoria'),
  body('costo').isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
  body('precio_venta').isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo'),
  body('pertenece_inventario').isBoolean().withMessage('El campo pertenece_inventario debe ser un booleano'),
  body('es_subproducto').isBoolean().withMessage('El campo es_subproducto debe ser un booleano'),
  body('minimo').optional().isFloat({ min: 0 }).withMessage('El mínimo debe ser un número positivo'),
  body('maximo').optional().isFloat({ min: 0 }).withMessage('El máximo debe ser un número positivo'),
  body('existencia').optional().isFloat({ min: 0 }).withMessage('La existencia debe ser un número positivo'),
  body('valor_total').optional().isFloat({ min: 0 }).withMessage('El valor total debe ser un número positivo')
];

const validateProductoCompraVentaUpdate = [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  body('descripcion_compra').notEmpty().withMessage('La descripción de compra es obligatoria'),
  body('descripcion_venta').notEmpty().withMessage('La descripción de venta es obligatoria'),
  body('costo').isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
  body('precio_venta').isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo'),
  body('pertenece_inventario').isBoolean().withMessage('El campo pertenece_inventario debe ser un booleano'),
  body('es_subproducto').isBoolean().withMessage('El campo es_subproducto debe ser un booleano'),
  body('minimo').optional().isFloat({ min: 0 }).withMessage('El mínimo debe ser un número positivo'),
  body('maximo').optional().isFloat({ min: 0 }).withMessage('El máximo debe ser un número positivo'),
  body('existencia').optional().isFloat({ min: 0 }).withMessage('La existencia debe ser un número positivo'),
  body('valor_total').optional().isFloat({ min: 0 }).withMessage('El valor total debe ser un número positivo')
];

const validateProductoCompraVentaId = [
  param('id').isInt().withMessage('El ID debe ser un número entero')
];

module.exports = {
  validateProductoCompraVentaCreate,
  validateProductoCompraVentaUpdate,
  validateProductoCompraVentaId
};