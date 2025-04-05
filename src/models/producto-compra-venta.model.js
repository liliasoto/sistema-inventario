const { pool } = require('../config/db');

class ProductoCompraVentaModel {
  // Obtener todos los productos
  async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT pcv.*, i.nombre, i.estado, i.precio_venta, p.nombre_compania as proveedor_nombre
        FROM PRODUCTO_COMPRA_VENTA pcv
        JOIN ITEM i ON pcv.item_id = i.id
        LEFT JOIN PROVEEDOR p ON pcv.proveedor_id = p.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un producto por ID
  async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT pcv.*, i.nombre, i.estado, i.precio_venta, p.nombre_compania as proveedor_nombre
        FROM PRODUCTO_COMPRA_VENTA pcv
        JOIN ITEM i ON pcv.item_id = i.id
        LEFT JOIN PROVEEDOR p ON pcv.proveedor_id = p.id
        WHERE pcv.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo producto (con transacción)
  async create(producto) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Primero creamos el item
      const { 
        nombre, estado, es_subproducto, clasificacion_id, descripcion_compra, 
        descripcion_venta, costo, proveedor_id, precio_venta, 
        pertenece_inventario, minimo, maximo, existencia, valor_total, fecha_inventario 
      } = producto;
      
      // Insertar en la tabla ITEM
      const [itemResult] = await connection.query(
        'INSERT INTO ITEM (nombre, tipo, estado, descripcion, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, 'compra_venta', estado, descripcion_venta, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto]
      );
      
      const itemId = itemResult.insertId;
      
      // Insertar en la tabla PRODUCTO_COMPRA_VENTA
      const [productoResult] = await connection.query(
        'INSERT INTO PRODUCTO_COMPRA_VENTA (item_id, descripcion_compra, descripcion_venta, costo, proveedor_id, minimo, maximo, existencia, valor_total, fecha_inventario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [itemId, descripcion_compra, descripcion_venta, costo, proveedor_id, minimo, maximo, existencia, valor_total, fecha_inventario]
      );
      
      await connection.commit();
      
      return { 
        id: productoResult.insertId, 
        item_id: itemId,
        ...producto 
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Actualizar un producto (con transacción)
  async update(id, producto) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Obtener el item_id asociado al producto
      const [productRows] = await connection.query('SELECT item_id FROM PRODUCTO_COMPRA_VENTA WHERE id = ?', [id]);
      if (!productRows.length) {
        throw new Error('Producto no encontrado');
      }
      
      const itemId = productRows[0].item_id;
      
      const { 
        nombre, estado, es_subproducto, clasificacion_id, descripcion_compra, 
        descripcion_venta, costo, proveedor_id, precio_venta, 
        pertenece_inventario, minimo, maximo, existencia, valor_total, fecha_inventario 
      } = producto;
      
      // Actualizar la tabla ITEM
      await connection.query(
        'UPDATE ITEM SET nombre = ?, estado = ?, descripcion = ?, precio_venta = ?, pertenece_inventario = ?, clasificacion_id = ?, es_subproducto = ? WHERE id = ?',
        [nombre, estado, descripcion_venta, precio_venta, pertenece_inventario, clasificacion_id, es_subproducto, itemId]
      );
      
      // Actualizar la tabla PRODUCTO_COMPRA_VENTA
      await connection.query(
        'UPDATE PRODUCTO_COMPRA_VENTA SET descripcion_compra = ?, descripcion_venta = ?, costo = ?, proveedor_id = ?, minimo = ?, maximo = ?, existencia = ?, valor_total = ?, fecha_inventario = ? WHERE id = ?',
        [descripcion_compra, descripcion_venta, costo, proveedor_id, minimo, maximo, existencia, valor_total, fecha_inventario, id]
      );
      
      await connection.commit();
      
      return { 
        id, 
        item_id: itemId,
        ...producto 
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Eliminar un producto (con transacción)
  async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Obtener el item_id asociado al producto
      const [rows] = await connection.query('SELECT item_id FROM PRODUCTO_COMPRA_VENTA WHERE id = ?', [id]);
      if (!rows.length) {
        throw new Error('Producto no encontrado');
      }
      
      const itemId = rows[0].item_id;
      
      // Eliminar de la tabla PRODUCTO_COMPRA_VENTA
      await connection.query('DELETE FROM PRODUCTO_COMPRA_VENTA WHERE id = ?', [id]);
      
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

module.exports = new ProductoCompraVentaModel();