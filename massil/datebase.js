const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'massil.db'));

db.serialize(() => {
  // Tabla de productos (editable desde el panel admin)
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      presentacion TEXT,
      precio REAL NOT NULL,
      descripcion TEXT,
      categoria TEXT,
      imagen TEXT,
      stock INTEGER DEFAULT 0,
      activo INTEGER DEFAULT 1
    )
  `);

  // Tabla de pedidos (los que llegan desde el carrito)
  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      telefono TEXT,
      productos TEXT,          -- JSON con los items del carrito
      total REAL,
      estado TEXT DEFAULT 'pendiente',
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Mensajes del formulario de contacto
  db.run(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      telefono TEXT,
      email TEXT,
      interes TEXT,
      mensaje TEXT,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;