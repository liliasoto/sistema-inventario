const materialModel = require('../models/material-manufactura.model');

class MaterialManufacturaController {
  // Obtener todos los materiales
  async getAll(req, res) {
    try {
      const materiales = await materialModel.getAll();
      res.status(200).json(materiales);
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      res.status(500).json({ message: 'Error al obtener materiales', error: error.message });
    }
  }

  // Obtener un material por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const material = await materialModel.getById(id);
      
      if (!material) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }
      
      res.status(200).json(material);
    } catch (error) {
      console.error('Error al obtener material:', error);
      res.status(500).json({ message: 'Error al obtener material', error: error.message });
    }
  }

  // Crear un nuevo material
  async create(req, res) {
    try {
      const newMaterial = await materialModel.create(req.body);
      res.status(201).json(newMaterial);
    } catch (error) {
      console.error('Error al crear material:', error);
      res.status(500).json({ message: 'Error al crear material', error: error.message });
    }
  }

  // Actualizar un material
  async update(req, res) {
    try {
      const id = req.params.id;
      const material = await materialModel.getById(id);
      
      if (!material) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }
      
      const updatedMaterial = await materialModel.update(id, req.body);
      res.status(200).json(updatedMaterial);
    } catch (error) {
      console.error('Error al actualizar material:', error);
      res.status(500).json({ message: 'Error al actualizar material', error: error.message });
    }
  }

  // Eliminar un material
  async delete(req, res) {
    try {
      const id = req.params.id;
      const material = await materialModel.getById(id);
      
      if (!material) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }
      
      await materialModel.delete(id);
      res.status(200).json({ message: 'Material eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar material:', error);
      res.status(500).json({ message: 'Error al eliminar material', error: error.message });
    }
  }

  // Obtener materiales por producto de manufactura
  async getByProductoId(req, res) {
    try {
      const productoId = req.params.productoId;
      const materiales = await materialModel.getByProductoId(productoId);
      res.status(200).json(materiales);
    } catch (error) {
      console.error('Error al obtener materiales por producto:', error);
      res.status(500).json({ message: 'Error al obtener materiales por producto', error: error.message });
    }
  }
}

module.exports = new MaterialManufacturaController();