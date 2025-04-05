const { pool } = require('../config/db');

class ProveedorModel {
  // Obtener todos los proveedores
  async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM PROVEEDOR');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un proveedor por ID
  async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM PROVEEDOR WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo proveedor
  async create(proveedor) {
    try {
      const {
        nombre_compania, nombre_completo, puesto, telefono_principal,
        telefono_otro1, telefono_otro2, telefono_otro3, email,
        website, otro1, otro2, direccion_cliente, direccion_entrega,
        estado, rfc, cuenta_banco, clabe, nombre_banco,
        limite_credito, condiciones_pago
      } = proveedor;
      
      const [result] = await pool.query(
        `INSERT INTO PROVEEDOR (
          nombre_compania, nombre_completo, puesto, telefono_principal,
          telefono_otro1, telefono_otro2, telefono_otro3, email,
          website, otro1, otro2, direccion_cliente, direccion_entrega,
          estado, rfc, cuenta_banco, clabe, nombre_banco,
          limite_credito, condiciones_pago
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombre_compania, nombre_completo, puesto, telefono_principal,
          telefono_otro1, telefono_otro2, telefono_otro3, email,
          website, otro1, otro2, direccion_cliente, direccion_entrega,
          estado, rfc, cuenta_banco, clabe, nombre_banco,
          limite_credito, condiciones_pago
        ]
      );
      
      return { id: result.insertId, ...proveedor };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un proveedor
  async update(id, proveedor) {
    try {
      const {
        nombre_compania, nombre_completo, puesto, telefono_principal,
        telefono_otro1, telefono_otro2, telefono_otro3, email,
        website, otro1, otro2, direccion_cliente, direccion_entrega,
        estado, rfc, cuenta_banco, clabe, nombre_banco,
        limite_credito, condiciones_pago
      } = proveedor;
      
      await pool.query(
        `UPDATE PROVEEDOR SET 
          nombre_compania = ?, nombre_completo = ?, puesto = ?, telefono_principal = ?,
          telefono_otro1 = ?, telefono_otro2 = ?, telefono_otro3 = ?, email = ?,
          website = ?, otro1 = ?, otro2 = ?, direccion_cliente = ?, direccion_entrega = ?,
          estado = ?, rfc = ?, cuenta_banco = ?, clabe = ?, nombre_banco = ?,
          limite_credito = ?, condiciones_pago = ?
        WHERE id = ?`,
        [
          nombre_compania, nombre_completo, puesto, telefono_principal,
          telefono_otro1, telefono_otro2, telefono_otro3, email,
          website, otro1, otro2, direccion_cliente, direccion_entrega,
          estado, rfc, cuenta_banco, clabe, nombre_banco,
          limite_credito, condiciones_pago, id
        ]
      );
      
      return { id, ...proveedor };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un proveedor
  async delete(id) {
    try {
      // Verificar si hay productos asociados a este proveedor
      const [productos] = await pool.query('SELECT COUNT(*) as count FROM PRODUCTO_COMPRA_VENTA WHERE proveedor_id = ?', [id]);
      if (productos[0].count > 0) {
        throw new Error('No se puede eliminar el proveedor porque tiene productos asociados');
      }
      
      await pool.query('DELETE FROM PROVEEDOR WHERE id = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }

  // Buscar proveedores por nombre
  async searchByName(name) {
    try {
      const [rows] = await pool.query('SELECT * FROM PROVEEDOR WHERE nombre_compania LIKE ? OR nombre_completo LIKE ?', [`%${name}%`, `%${name}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener productos por proveedor
  async getProductosByProveedor(id) {
    try {
      const [rows] = await pool.query(`
        SELECT pcv.*, i.nombre, i.estado, i.precio_venta
        FROM PRODUCTO_COMPRA_VENTA pcv
        JOIN ITEM i ON pcv.item_id = i.id
        WHERE pcv.proveedor_id = ?
      `, [id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProveedorModel();