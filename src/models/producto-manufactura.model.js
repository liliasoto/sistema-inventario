const { pool } = require('../config/db');

class ProductoManufacturaModel {
  // Obtener todos los productos de manufactura
  async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT pm.*, i.nombre, i.estado, i.descripcion, i.precio_venta
        FROM PRODUCTO_MANUFACTURA pm
        JOIN ITEM i ON pm.item_id = i.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un producto de manufactura por ID
  async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT pm.*, i.nombre, i.estado, i.descripcion, i.precio_venta
        FROM PRODUCTO_MANUFACTURA pm
        JOIN ITEM i ON pm.item_id = i.id
        WHERE pm.id = ?
      `, [id]);
      
      if (!rows.length) return null;
      
      // Obtener los materiales asociados a este producto
      const [materiales] = await pool.query(`
        SELECT mm.*, i.nombre, i.precio_venta
        FROM MATERIAL_MANUFACTURA mm
        JOIN ITEM i ON mm.item_id = i.id
        WHERE mm.producto_manufactura_id = ?
      `, [id]);
      
      return {
        ...rows[0],
        materiales
      };
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo producto de manufactura (con transacción)
  async create(producto) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const { 
        nombre, estado, descripcion, es_subproducto, clasificacion_id,
        precio_venta, pertenece_inventario, minimo, maximo, 
        existencia, valor_total, fecha_inventario, materiales 
      } = producto;
      
      // Insertar en la tabla ITEM
      const [itemResult] = await connection.query(
        'INSERT INTO ITEM (nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, 'manufactura', estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto]
      );
      
      const itemId = itemResult.insertId;
      
      // Calcular el costo total basado en los materiales
      let costoTotal = 0;
      if (materiales && materiales.length > 0) {
        costoTotal = materiales.reduce((sum, material) => sum + parseFloat(material.subtotal || 0), 0);
      }
      
      // Insertar en la tabla PRODUCTO_MANUFACTURA
      const [productoResult] = await connection.query(
        'INSERT INTO PRODUCTO_MANUFACTURA (item_id, costo, minimo, maximo, existencia, valor_total, fecha_inventario) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [itemId, costoTotal, minimo, maximo, existencia, valor_total, fecha_inventario]
      );
      
      const productoId = productoResult.insertId;
      
      // Insertar los materiales si existen
      if (materiales && materiales.length > 0) {
        for (const material of materiales) {
          await connection.query(
            'INSERT INTO MATERIAL_MANUFACTURA (producto_manufactura_id, item_id, descripcion, cantidad, subtotal) VALUES (?, ?, ?, ?, ?)',
            [productoId, material.item_id, material.descripcion, material.cantidad, material.subtotal]
          );
        }
      }
      
      await connection.commit();
      
      return { 
        id: productoId, 
        item_id: itemId,
        costo: costoTotal,
        ...producto 
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Actualizar un producto de manufactura (con transacción)
  async update(id, producto) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Obtener el item_id asociado al producto
      const [productRows] = await connection.query('SELECT item_id FROM PRODUCTO_MANUFACTURA WHERE id = ?', [id]);
      if (!productRows.length) {
        throw new Error('Producto no encontrado');
      }
      
      const itemId = productRows[0].item_id;
      
      const { 
        nombre, estado, descripcion, es_subproducto, clasificacion_id,
        precio_venta, pertenece_inventario, minimo, maximo, 
        existencia, valor_total, fecha_inventario, materiales 
      } = producto;
      
      // Actualizar la tabla ITEM
      await connection.query(
        'UPDATE ITEM SET nombre = ?, estado = ?, descripcion = ?, precio_venta = ?, pertenece_inventario = ?, clasificacion_id = ?, es_subproducto = ? WHERE id = ?',
        [nombre, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto, itemId]
      );
      
      // Calcular el costo total basado en los materiales
      let costoTotal = 0;
      if (materiales && materiales.length > 0) {
        costoTotal = materiales.reduce((sum, material) => sum + parseFloat(material.subtotal || 0), 0);
      }
      
      // Actualizar la tabla PRODUCTO_MANUFACTURA
      await connection.query(
        'UPDATE PRODUCTO_MANUFACTURA SET costo = ?, minimo = ?, maximo = ?, existencia = ?, valor_total = ?, fecha_inventario = ? WHERE id = ?',
        [costoTotal, minimo, maximo, existencia, valor_total, fecha_inventario, id]
      );
      
      // Eliminar los materiales existentes
      await connection.query('DELETE FROM MATERIAL_MANUFACTURA WHERE producto_manufactura_id = ?', [id]);
      
      // Insertar los nuevos materiales
      if (materiales && materiales.length > 0) {
        for (const material of materiales) {
          await connection.query(
            'INSERT INTO MATERIAL_MANUFACTURA (producto_manufactura_id, item_id, descripcion, cantidad, subtotal) VALUES (?, ?, ?, ?, ?)',
            [id, material.item_id, material.descripcion, material.cantidad, material.subtotal]
          );
        }
      }
      
      await connection.commit();
      
      return { 
        id, 
        item_id: itemId,
        costo: costoTotal,
        ...producto 
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Eliminar un producto de manufactura (con transacción)
  async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Obtener el item_id asociado al producto
      const [rows] = await connection.query('SELECT item_id FROM PRODUCTO_MANUFACTURA WHERE id = ?', [id]);
      if (!rows.length) {
        throw new Error('Producto no encontrado');
      }
      
      const itemId = rows[0].item_id;
      
      // Eliminar los materiales asociados
      await connection.query('DELETE FROM MATERIAL_MANUFACTURA WHERE producto_manufactura_id = ?', [id]);
      
      // Eliminar de la tabla PRODUCTO_MANUFACTURA
      await connection.query('DELETE FROM PRODUCTO_MANUFACTURA WHERE id = ?', [id]);
      
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

  // Obtener los materiales de un producto de manufactura
  async getMateriales(id) {
    try {
      const [rows] = await pool.query(`
        SELECT mm.*, i.nombre, i.precio_venta
        FROM MATERIAL_MANUFACTURA mm
        JOIN ITEM i ON mm.item_id = i.id
        WHERE mm.producto_manufactura_id = ?
      `, [id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductoManufacturaModel();