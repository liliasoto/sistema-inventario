const productoModel = require('../models/producto-compra-venta.model');

class ProductoCompraVentaController {
  // Obtener todos los productos
  async getAll(req, res) {
    try {
      const productos = await productoModel.getAll();
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
  }

  // Obtener un producto por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const producto = await productoModel.getById(id);
      
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      res.status(200).json(producto);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
  }

  // Crear un nuevo producto
  async create(req, res) {
    try {
      const newProducto = await productoModel.create(req.body);
      res.status(201).json(newProducto);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
  }

  // Actualizar un producto
  async update(req, res) {
    try {
      const id = req.params.id;
      const producto = await productoModel.getById(id);
      
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      const updatedProducto = await productoModel.update(id, req.body);
      res.status(200).json(updatedProducto);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
  }

  // Eliminar un producto
  async delete(req, res) {
    try {
      const id = req.params.id;
      const producto = await productoModel.getById(id);
      
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      await productoModel.delete(id);
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
  }
}

module.exports = new ProductoCompraVentaController();