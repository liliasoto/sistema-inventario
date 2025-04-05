const servicioModel = require('../models/servicio.model');

class ServicioController {
  // Obtener todos los servicios
  async getAll(req, res) {
    try {
      const servicios = await servicioModel.getAll();
      res.status(200).json(servicios);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      res.status(500).json({ message: 'Error al obtener servicios', error: error.message });
    }
  }

  // Obtener un servicio por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const servicio = await servicioModel.getById(id);
      
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
      
      res.status(200).json(servicio);
    } catch (error) {
      console.error('Error al obtener servicio:', error);
      res.status(500).json({ message: 'Error al obtener servicio', error: error.message });
    }
  }

  // Crear un nuevo servicio
  async create(req, res) {
    try {
      const newServicio = await servicioModel.create(req.body);
      res.status(201).json(newServicio);
    } catch (error) {
      console.error('Error al crear servicio:', error);
      res.status(500).json({ message: 'Error al crear servicio', error: error.message });
    }
  }

  // Actualizar un servicio
  async update(req, res) {
    try {
      const id = req.params.id;
      const servicio = await servicioModel.getById(id);
      
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
      
      const updatedServicio = await servicioModel.update(id, req.body);
      res.status(200).json(updatedServicio);
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      res.status(500).json({ message: 'Error al actualizar servicio', error: error.message });
    }
  }

  // Eliminar un servicio
  async delete(req, res) {
    try {
      const id = req.params.id;
      const servicio = await servicioModel.getById(id);
      
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
      
      await servicioModel.delete(id);
      res.status(200).json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      res.status(500).json({ message: 'Error al eliminar servicio', error: error.message });
    }
  }
}

module.exports = new ServicioController();