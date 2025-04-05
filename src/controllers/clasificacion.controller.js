const clasificacionModel = require('../models/clasificacion.model');

class ClasificacionController {
  // Obtener todas las clasificaciones
  async getAll(req, res) {
    try {
      const clasificaciones = await clasificacionModel.getAll();
      res.status(200).json(clasificaciones);
    } catch (error) {
      console.error('Error al obtener clasificaciones:', error);
      res.status(500).json({ message: 'Error al obtener clasificaciones', error: error.message });
    }
  }

  // Obtener una clasificación por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const clasificacion = await clasificacionModel.getById(id);
      
      if (!clasificacion) {
        return res.status(404).json({ message: 'Clasificación no encontrada' });
      }
      
      res.status(200).json(clasificacion);
    } catch (error) {
      console.error('Error al obtener clasificación:', error);
      res.status(500).json({ message: 'Error al obtener clasificación', error: error.message });
    }
  }

  // Crear una nueva clasificación
  async create(req, res) {
    try {
      const newClasificacion = await clasificacionModel.create(req.body);
      res.status(201).json(newClasificacion);
    } catch (error) {
      console.error('Error al crear clasificación:', error);
      res.status(500).json({ message: 'Error al crear clasificación', error: error.message });
    }
  }

  // Actualizar una clasificación
  async update(req, res) {
    try {
      const id = req.params.id;
      const clasificacion = await clasificacionModel.getById(id);
      
      if (!clasificacion) {
        return res.status(404).json({ message: 'Clasificación no encontrada' });
      }
      
      const updatedClasificacion = await clasificacionModel.update(id, req.body);
      res.status(200).json(updatedClasificacion);
    } catch (error) {
      console.error('Error al actualizar clasificación:', error);
      res.status(500).json({ message: 'Error al actualizar clasificación', error: error.message });
    }
  }

  // Eliminar una clasificación
  async delete(req, res) {
    try {
      const id = req.params.id;
      const clasificacion = await clasificacionModel.getById(id);
      
      if (!clasificacion) {
        return res.status(404).json({ message: 'Clasificación no encontrada' });
      }
      
      await clasificacionModel.delete(id);
      res.status(200).json({ message: 'Clasificación eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar clasificación:', error);
      
      // Si el error es porque hay productos asociados, devolver un código 400
      if (error.message.includes('tiene productos asociados')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Error al eliminar clasificación', error: error.message });
    }
  }

  // Obtener productos por clasificación
  async getProductosByClasificacion(req, res) {
    try {
      const id = req.params.id;
      const productos = await clasificacionModel.getProductosByClasificacion(id);
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos por clasificación:', error);
      res.status(500).json({ message: 'Error al obtener productos por clasificación', error: error.message });
    }
  }
}

module.exports = new ClasificacionController();