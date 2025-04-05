const itemModel = require('../models/item.model');

class ItemController {
  // Obtener todos los items
  async getAll(req, res) {
    try {
      const items = await itemModel.getAll();
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener items:', error);
      res.status(500).json({ message: 'Error al obtener items', error: error.message });
    }
  }

  // Obtener un item por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const item = await itemModel.getById(id);
      
      if (!item) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      
      res.status(200).json(item);
    } catch (error) {
      console.error('Error al obtener item:', error);
      res.status(500).json({ message: 'Error al obtener item', error: error.message });
    }
  }

  // Crear un nuevo item
  async create(req, res) {
    try {
      const newItem = await itemModel.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error al crear item:', error);
      res.status(500).json({ message: 'Error al crear item', error: error.message });
    }
  }

  // Actualizar un item
  async update(req, res) {
    try {
      const id = req.params.id;
      const item = await itemModel.getById(id);
      
      if (!item) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      
      const updatedItem = await itemModel.update(id, req.body);
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error al actualizar item:', error);
      res.status(500).json({ message: 'Error al actualizar item', error: error.message });
    }
  }

  // Eliminar un item
  async delete(req, res) {
    try {
      const id = req.params.id;
      const item = await itemModel.getById(id);
      
      if (!item) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      
      await itemModel.delete(id);
      res.status(200).json({ message: 'Item eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar item:', error);
      res.status(500).json({ message: 'Error al eliminar item', error: error.message });
    }
  }

  // Buscar items por nombre
  async searchByName(req, res) {
    try {
      const name = req.query.name;
      if (!name) {
        return res.status(400).json({ message: 'Se requiere un nombre para la búsqueda' });
      }
      
      const items = await itemModel.searchByName(name);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al buscar items:', error);
      res.status(500).json({ message: 'Error al buscar items', error: error.message });
    }
  }

  // Obtener items por tipo
  async getByType(req, res) {
    try {
      const type = req.params.type;
      if (!['compra_venta', 'manufactura', 'servicio'].includes(type)) {
        return res.status(400).json({ message: 'Tipo de item no válido' });
      }
      
      const items = await itemModel.getByType(type);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error al obtener items por tipo:', error);
      res.status(500).json({ message: 'Error al obtener items por tipo', error: error.message });
    }
  }
}

module.exports = new ItemController();