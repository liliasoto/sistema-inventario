const proveedorModel = require('../models/proveedor.model');

class ProveedorController {
  // Obtener todos los proveedores
  async getAll(req, res) {
    try {
      const proveedores = await proveedorModel.getAll();
      res.status(200).json(proveedores);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
    }
  }

  // Obtener un proveedor por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const proveedor = await proveedorModel.getById(id);
      
      if (!proveedor) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }
      
      res.status(200).json(proveedor);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({ message: 'Error al obtener proveedor', error: error.message });
    }
  }

  // Crear un nuevo proveedor
  async create(req, res) {
    try {
      const newProveedor = await proveedorModel.create(req.body);
      res.status(201).json(newProveedor);
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      res.status(500).json({ message: 'Error al crear proveedor', error: error.message });
    }
  }

  // Actualizar un proveedor
  async update(req, res) {
    try {
      const id = req.params.id;
      const proveedor = await proveedorModel.getById(id);
      
      if (!proveedor) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }
      
      const updatedProveedor = await proveedorModel.update(id, req.body);
      res.status(200).json(updatedProveedor);
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message });
    }
  }

  // Eliminar un proveedor
  async delete(req, res) {
    try {
      const id = req.params.id;
      const proveedor = await proveedorModel.getById(id);
      
      if (!proveedor) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }
      
      await proveedorModel.delete(id);
      res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      
      // Si el error es porque hay productos asociados, devolver un código 400
      if (error.message.includes('tiene productos asociados')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Error al eliminar proveedor', error: error.message });
    }
  }

  // Buscar proveedores por nombre
  async searchByName(req, res) {
    try {
      const name = req.query.name;
      if (!name) {
        return res.status(400).json({ message: 'Se requiere un nombre para la búsqueda' });
      }
      
      const proveedores = await proveedorModel.searchByName(name);
      res.status(200).json(proveedores);
    } catch (error) {
      console.error('Error al buscar proveedores:', error);
      res.status(500).json({ message: 'Error al buscar proveedores', error: error.message });
    }
  }

  // Obtener productos por proveedor
  async getProductosByProveedor(req, res) {
    try {
      const id = req.params.id;
      const productos = await proveedorModel.getProductosByProveedor(id);
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos por proveedor:', error);
      res.status(500).json({ message: 'Error al obtener productos por proveedor', error: error.message });
    }
  }
}

module.exports = new ProveedorController();