const { pool } = require('../config/db');

class MaterialManufacturaModel {
  // Obtener todos los materiales
  async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT mm.*, i.nombre as item_nombre, pm.id as producto_id
        FROM MATERIAL_MANUFACTURA mm
        JOIN ITEM i ON mm.item_id = i.id
        JOIN PRODUCTO_MANUFACTURA pm ON mm.producto_manufactura_id = pm.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un material por ID
  async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT mm.*, i.nombre as item_nombre, pm.id as producto_id
        FROM MATERIAL_MANUFACTURA mm
        JOIN ITEM i ON mm.item_id = i.id
        JOIN PRODUCTO_MANUFACTURA pm ON mm.producto_manufactura_id = pm.id
        WHERE mm.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo material
  async create(material) {
    try {
      const { producto_manufactura_id, item_id, descripcion, cantidad, subtotal } = material;
      
      const [result] = await pool.query(
        'INSERT INTO MATERIAL_MANUFACTURA (producto_manufactura_id, item_id, descripcion, cantidad, subtotal) VALUES (?, ?, ?, ?, ?)',
        [producto_manufactura_id, item_id, descripcion, cantidad, subtotal]
      );
      
      // Actualizar el costo total del producto de manufactura
      await this.updateProductoCosto(producto_manufactura_id);
      
      return { id: result.insertId, ...material };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un material
  async update(id, material) {
    try {
      const { producto_manufactura_id, item_id, descripcion, cantidad, subtotal } = material;
      
      await pool.query(
        'UPDATE MATERIAL_MANUFACTURA SET producto_manufactura_id = ?, item_id = ?, descripcion = ?, cantidad = ?, subtotal = ? WHERE id = ?',
        [producto_manufactura_id, item_id, descripcion, cantidad, subtotal, id]
      );
      
      // Actualizar el costo total del producto de manufactura
      await this.updateProductoCosto(producto_manufactura_id);
      
      return { id, ...material };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un material
  async delete(id) {
    try {
      // Obtener el producto_manufactura_id antes de eliminar
      const [material] = await pool.query('SELECT producto_manufactura_id FROM MATERIAL_MANUFACTURA WHERE id = ?', [id]);
      if (!material.length) {
        throw new Error('Material no encontrado');
      }
      
      const producto_manufactura_id = material[0].producto_manufactura_id;
      
      await pool.query('DELETE FROM MATERIAL_MANUFACTURA WHERE id = ?', [id]);
      
      // Actualizar el costo total del producto de manufactura
      await this.updateProductoCosto(producto_manufactura_id);
      
      return { id };
    } catch (error) {
      throw error;
    }
  }

  // Obtener materiales por producto de manufactura
  async getByProductoId(productoId) {
    try {
      const [rows] = await pool.query(`
        SELECT mm.*, i.nombre as item_nombre, i.precio_venta
        FROM MATERIAL_MANUFACTURA mm
        JOIN ITEM i ON mm.item_id = i.id
        WHERE mm.producto_manufactura_id = ?
      `, [productoId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar el costo total del producto de manufactura
  async updateProductoCosto(productoId) {
    try {
      // Calcular la suma de los subtotales de los materiales
      const [result] = await pool.query(
        'SELECT SUM(subtotal) as costo_total FROM MATERIAL_MANUFACTURA WHERE producto_manufactura_id = ?',
        [productoId]
      );
      
      const costoTotal = result[0].costo_total || 0;
      
      // Actualizar el costo del producto de manufactura
      await pool.query(
        'UPDATE PRODUCTO_MANUFACTURA SET costo = ? WHERE id = ?',
        [costoTotal, productoId]
      );
      
      return { productoId, costoTotal };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MaterialManufacturaModel();