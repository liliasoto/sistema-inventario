-- Usar
USE railway;

-- Crear tabla de clasificaciones
CREATE TABLE CLASIFICACION (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de proveedores
CREATE TABLE PROVEEDOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_compania VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    puesto VARCHAR(100),
    telefono_principal VARCHAR(20) NOT NULL,
    telefono_otro1 VARCHAR(50),
    telefono_otro2 VARCHAR(50),
    telefono_otro3 VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    otro1 VARCHAR(255),
    otro2 VARCHAR(255),
    direccion_cliente TEXT,
    direccion_entrega TEXT,
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    rfc VARCHAR(20),
    cuenta_banco VARCHAR(50),
    clabe VARCHAR(18),
    nombre_banco VARCHAR(100),
    limite_credito DECIMAL(10,2),
    condiciones_pago ENUM('Consignacion', 'Pago al recibir', 'Pago a 15 dias', 'Pago a 30 dias', 'Pago a 60 dias')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla principal de items
CREATE TABLE ITEM (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('compra_venta', 'manufactura', 'servicio') NOT NULL,
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    descripcion TEXT,
    precio_venta DECIMAL(10,2),
    pertenece_inventario BOOLEAN DEFAULT FALSE,
    clasificacion_id INT,
    es_subproducto BOOLEAN DEFAULT FALSE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clasificacion_id) REFERENCES CLASIFICACION(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de productos de compra y venta
CREATE TABLE PRODUCTO_COMPRA_VENTA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    descripcion_compra TEXT,
    descripcion_venta TEXT,
    costo DECIMAL(10,2),
    proveedor_id INT,
    minimo DECIMAL(10,4),
    maximo DECIMAL(10,4),
    existencia DECIMAL(10,4),
    valor_total DECIMAL(10,2),
    fecha_inventario DATE,
    FOREIGN KEY (item_id) REFERENCES ITEM(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES PROVEEDOR(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de productos de manufactura
CREATE TABLE PRODUCTO_MANUFACTURA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    costo DECIMAL(10,2),
    minimo DECIMAL(10,4),
    maximo DECIMAL(10,4),
    existencia DECIMAL(10,4),
    valor_total DECIMAL(10,2),
    fecha_inventario DATE,
    FOREIGN KEY (item_id) REFERENCES ITEM(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de servicios
CREATE TABLE SERVICIO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    descripcion_servicio TEXT,
    FOREIGN KEY (item_id) REFERENCES ITEM(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de materiales para productos de manufactura
CREATE TABLE MATERIAL_MANUFACTURA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_manufactura_id INT NOT NULL,
    item_id INT NOT NULL,
    descripcion TEXT,
    cantidad DECIMAL(10,4),
    subtotal DECIMAL(10,2),
    FOREIGN KEY (producto_manufactura_id) REFERENCES PRODUCTO_MANUFACTURA(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES ITEM(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_item_tipo ON ITEM(tipo);
CREATE INDEX idx_item_estado ON ITEM(estado);
CREATE INDEX idx_item_clasificacion ON ITEM(clasificacion_id);
CREATE INDEX idx_producto_compra_venta_proveedor ON PRODUCTO_COMPRA_VENTA(proveedor_id);
CREATE INDEX idx_material_manufactura_item ON MATERIAL_MANUFACTURA(item_id);