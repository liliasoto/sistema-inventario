const productoModel = require('../models/producto-manufactura.model');

class ProductoManufacturaController {
  // Obtener todos los productos de manufactura
  async getAll(req, res) {
    try {
      const productos = await productoModel.getAll();
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos de manufactura:', error);
      res.status(500).json({ message: 'Error al obtener productos de manufactura', error: error.message });
    }
  }

  // Obtener un producto de manufactura por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const producto = await productoModel.getById(id);
      
      if (!producto) {
        return res.status(404).json({ message: 'Producto de manufactura no encontrado' });
      }
      
      res.status(200).json(producto);
    } catch (error) {
      console.error('Error al obtener producto de manufactura:', error);
      res.status(500).json({ message: 'Error al obtener producto de manufactura', error: error.message });
    }
  }

  // Crear un nuevo producto de manufactura
  async create(req, res) {
    try {
      const newProducto = await productoModel.create(req.body);
      res.status(201).json(newProducto);
    } catch (error) {
      console.error('Error al crear producto de manufactura:', error);
      res.status(500).json({ message: 'Error al crear producto de manufactura', error: error.message });
    }
  }

  // Actualizar un producto de manufactura
  async update(req, res) {
    try {
      const id = req.params.id;
      const producto = await productoModel.getById(id);
      
      if (!producto) {
        return res.status(404).json({ message: 'Producto de manufactura no encontrado' });
      }
      
      const updatedProducto = await productoModel.update(id, req.body);
      res.status(200).json(updatedProducto);
    } catch (error) {
      console.error('Error al actualizar producto de manufactura:', error);
      res.status(500).json({ message: 'Error al actualizar producto de manufactura', error: error.message });
    }
  }

  // Eliminar un producto de manufactura
  async delete(req, res) {
    try {
      const id = req.params.id;
      const producto = await productoModel.getById(id);
      
      if (!producto) {
        return res.status(404).json({ message: 'Producto de manufactura no encontrado' });
      }
      
      await productoModel.delete(id);
      res.status(200).json({ message: 'Producto de manufactura eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar producto de manufactura:', error);
      res.status(500).json({ message: 'Error al eliminar producto de manufactura', error: error.message });
    }
  }

  // Obtener los materiales de un producto de manufactura
  async getMateriales(req, res) {
    try {
      const id = req.params.id;
      const materiales = await productoModel.getMateriales(id);
      res.status(200).json(materiales);
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      res.status(500).json({ message: 'Error al obtener materiales', error: error.message });
    }
  }
}

module.exports = new ProductoManufacturaController();