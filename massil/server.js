const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Conectar con la base de datos
const db = new sqlite3.Database(
    path.join(__dirname, "massil.db"),
    (err) => {
        if (err) {
            console.error("❌ Error al conectar con SQLite:", err.message);
        } else {
            console.log("✅ Conectado correctamente a massil.db");
        }
    }
);

// Permitir recibir datos JSON
app.use(express.json());

// Servir los archivos de tu página web
app.use(express.static(__dirname));

// Ruta para probar la conexión
app.get("/prueba", (req, res) => {
    res.json({
        mensaje: "Servidor funcionando correctamente"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
});



const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

/* ---------- PRODUCTOS ---------- */

// Listar productos activos (los usa la tienda)
app.get('/api/productos', (req, res) => {
  db.all('SELECT * FROM productos WHERE activo = 1', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear producto (panel admin)
app.post('/api/productos', (req, res) => {
  const { nombre, presentacion, precio, descripcion, categoria, imagen, stock } = req.body;
  db.run(
    `INSERT INTO productos (nombre, presentacion, precio, descripcion, categoria, imagen, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, presentacion, precio, descripcion, categoria, imagen, stock],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Editar producto
app.put('/api/productos/:id', (req, res) => {
  const { nombre, presentacion, precio, descripcion, categoria, imagen, stock } = req.body;
  db.run(
    `UPDATE productos SET nombre=?, presentacion=?, precio=?, descripcion=?, categoria=?, imagen=?, stock=?
     WHERE id=?`,
    [nombre, presentacion, precio, descripcion, categoria, imagen, stock, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ cambios: this.changes });
    }
  );
});

// Eliminar producto (borrado lógico)
app.delete('/api/productos/:id', (req, res) => {
  db.run('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ cambios: this.changes });
  });
});

/* ---------- PEDIDOS ---------- */

app.post('/api/pedidos', (req, res) => {
  const { cliente, telefono, productos, total } = req.body;
  db.run(
    `INSERT INTO pedidos (cliente, telefono, productos, total) VALUES (?, ?, ?, ?)`,
    [cliente, telefono, JSON.stringify(productos), total],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.get('/api/pedidos', (req, res) => {
  db.all('SELECT * FROM pedidos ORDER BY fecha DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/pedidos/:id', (req, res) => {
  db.run('UPDATE pedidos SET estado = ? WHERE id = ?', [req.body.estado, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ cambios: this.changes });
    });
});

/* ---------- MENSAJES (formulario de contacto) ---------- */

app.post('/api/mensajes', (req, res) => {
  const { nombre, telefono, email, interes, mensaje } = req.body;
  db.run(
    `INSERT INTO mensajes (nombre, telefono, email, interes, mensaje) VALUES (?, ?, ?, ?, ?)`,
    [nombre, telefono, email, interes, mensaje],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.get('/api/mensajes', (req, res) => {
  db.all('SELECT * FROM mensajes ORDER BY fecha DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`MASSIL corriendo en http://localhost:${PORT}`));
