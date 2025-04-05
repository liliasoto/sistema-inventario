const { pool } = require('../config/db');

class ClasificacionModel {
  // Obtener todas las clasificaciones
  async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM CLASIFICACION');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una clasificación por ID
  async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM CLASIFICACION WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva clasificación
  async create(clasificacion) {
    try {
      const { nombre } = clasificacion;
      
      const [result] = await pool.query(
        'INSERT INTO CLASIFICACION (nombre) VALUES (?)',
        [nombre]
      );
      
      return { id: result.insertId, nombre };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una clasificación
  async update(id, clasificacion) {
    try {
      const { nombre } = clasificacion;
      
      await pool.query(
        'UPDATE CLASIFICACION SET nombre = ? WHERE id = ?',
        [nombre, id]
      );
      
      return { id, nombre };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una clasificación
  async delete(id) {
    try {
      // Verificar si hay productos asociados a esta clasificación
      const [items] = await pool.query('SELECT COUNT(*) as count FROM ITEM WHERE clasificacion_id = ?', [id]);
      if (items[0].count > 0) {
        throw new Error('No se puede eliminar la clasificación porque tiene productos asociados');
      }
      
      await pool.query('DELETE FROM CLASIFICACION WHERE id = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }

  // Obtener productos por clasificación
  async getProductosByClasificacion(id) {
    try {
      const [rows] = await pool.query(`
        SELECT i.id, i.nombre, i.tipo, i.estado, i.precio_venta
        FROM ITEM i
        WHERE i.clasificacion_id = ?
      `, [id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ClasificacionModel();