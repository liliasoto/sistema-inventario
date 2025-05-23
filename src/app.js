const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const itemRoutes = require('./routes/item.routes');
const productoCompraVentaRoutes = require('./routes/producto-compra-venta.routes');
const productoManufacturaRoutes = require('./routes/producto-manufactura.routes');
const servicioRoutes = require('./routes/servicio.routes');
const clasificacionRoutes = require('./routes/clasificacion.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const materialManufacturaRoutes = require('./routes/material-manufactura.routes');

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Probar la conexión a la base de datos
testConnection();

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Inventario funcionando correctamente' });
});

// Rutas de la API
app.use('/api/items', itemRoutes);
app.use('/api/productos-compra-venta', productoCompraVentaRoutes);
app.use('/api/productos-manufactura', productoManufacturaRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/clasificaciones', clasificacionRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/materiales', materialManufacturaRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;