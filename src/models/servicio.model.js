const { pool } = require('../config/db');

class ServicioModel {
  // Obtener todos los servicios
  async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT s.*, i.nombre, i.estado, i.precio_venta
        FROM SERVICIO s
        JOIN ITEM i ON s.item_id = i.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un servicio por ID
  async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT s.*, i.nombre, i.estado, i.precio_venta
        FROM SERVICIO s
        JOIN ITEM i ON s.item_id = i.id
        WHERE s.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo servicio (con transacción)
  async create(servicio) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const { nombre, estado, descripcion_servicio, precio_venta } = servicio;
      
      // Insertar en la tabla ITEM
      const [itemResult] = await connection.query(
        'INSERT INTO ITEM (nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, 'servicio', estado, descripcion_servicio, precio_venta, false]
      );
      
      const itemId = itemResult.insertId;
      
      // Insertar en la tabla SERVICIO
      const [servicioResult] = await connection.query(
        'INSERT INTO SERVICIO (item_id, descripcion_servicio) VALUES (?, ?)',
        [itemId, descripcion_servicio]
      );
      
      await connection.commit();
      
      return { 
        id: servicioResult.insertId, 
        item_id: itemId,
        ...servicio 
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Actualizar un servicio (con transacción)
  async update(id, servicio) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Obtener el item_id asociado al servicio
      const [serviceRows] = await connection.query('SELECT item_id FROM SERVICIO WHERE id = ?', [id]);
      if (!serviceRows.length) {
        throw new Error('Servicio no encontrado');
      }
      
      const itemId = serviceRows[0].item_id;
      
      const { nombre, estado, descripcion_servicio, precio_venta } = servicio;
      
      // Actualizar la tabla ITEM
      await connection.query(
        'UPDATE ITEM SET nombre = ?, estado = ?, descripcion = ?, precio_venta = ? WHERE id = ?',
        [nombre, estado, descripcion_servicio, precio_venta, itemId]
      );
      
      // Actualizar la tabla SERVICIO
      await connection.query(
        'UPDATE SERVICIO SET descripcion_servicio = ? WHERE id = ?',
        [descripcion_servicio, id]
      );
      
      await connection.commit();
      
      return { 
        id, 
        item_id: itemId,
        ...servicio 
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Eliminar un servicio (con transacción)
  async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Obtener el item_id asociado al servicio
      const [rows] = await connection.query('SELECT item_id FROM SERVICIO WHERE id = ?', [id]);
      if (!rows.length) {
        throw new Error('Servicio no encontrado');
      }
      
      const itemId = rows[0].item_id;
      
      // Eliminar de la tabla SERVICIO
      await connection.query('DELETE FROM SERVICIO WHERE id = ?', [id]);
      
      // Eliminar de la tabla ITEM
      await connection.query('DELETE FROM ITEM WHERE id = ?', [itemId]);
      
      await connection.commit();
      
      return { id, itemId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new ServicioModel();