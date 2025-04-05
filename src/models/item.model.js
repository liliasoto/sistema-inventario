const { pool } = require('../config/db');

class ItemModel {
  // Obtener todos los items
  async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM ITEM');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un item por ID
  async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM ITEM WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo item
  async create(item) {
    try {
      const { nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto } = item;
      
      const [result] = await pool.query(
        'INSERT INTO ITEM (nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto]
      );
      
      return { id: result.insertId, ...item };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un item
  async update(id, item) {
    try {
      const { nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto } = item;
      
      await pool.query(
        'UPDATE ITEM SET nombre = ?, tipo = ?, estado = ?, descripcion = ?, precio_venta = ?, pertenece_inventario = ?, clasificacion_id = ?, es_subproducto = ? WHERE id = ?',
        [nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto, id]
      );
      
      return { id, ...item };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un item
  async delete(id) {
    try {
      await pool.query('DELETE FROM ITEM WHERE id = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }

  // Buscar items por nombre
  async searchByName(name) {
    try {
      const [rows] = await pool.query('SELECT * FROM ITEM WHERE nombre LIKE ?', [`%${name}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener items por tipo
  async getByType(type) {
    try {
      const [rows] = await pool.query('SELECT * FROM ITEM WHERE tipo = ?', [type]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ItemModel();