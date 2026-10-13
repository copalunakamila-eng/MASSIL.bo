```javascript
/* ================================================
   MASSIL — cart.js
   Carrito de compras + WhatsApp
   ================================================ */

(function () {

  let carrito = JSON.parse(
    localStorage.getItem('massil_carrito')
  ) || [];


  /* ================================================
     GUARDAR CARRITO
     ================================================ */

  function guardar() {

    localStorage.setItem(
      'massil_carrito',
      JSON.stringify(carrito)
    );

    actualizarContador();
  }


  /* ================================================
     AGREGAR PRODUCTO
     ================================================ */

  function agregar(producto) {

    const existe = carrito.find(function (p) {
      return p.nombre === producto.nombre;
    });

    if (existe) {

      existe.cantidad++;

    } else {

      carrito.push({
        nombre: producto.nombre,
        precio: Number(producto.precio),
        cantidad: 1
      });

    }

    guardar();
    render();
    abrirCarrito();
  }


  /* ================================================
     ELIMINAR PRODUCTO
     ================================================ */

  function eliminar(nombre) {

    carrito = carrito.filter(function (p) {
      return p.nombre !== nombre;
    });

    guardar();
    render();
  }


  /* ================================================
     CAMBIAR CANTIDAD
     ================================================ */

  function cambiarCantidad(nombre, cantidad) {

    const producto = carrito.find(function (p) {
      return p.nombre === nombre;
    });

    if (!producto) return;

    producto.cantidad += cantidad;

    if (producto.cantidad <= 0) {
      eliminar(nombre);
      return;
    }

    guardar();
    render();
  }


  /* ================================================
     CALCULAR TOTAL
     ================================================ */

  function calcularTotal() {

    return carrito.reduce(function (total, producto) {

      return total +
        (Number(producto.precio) *
        Number(producto.cantidad));

    }, 0);
  }


  /* ================================================
     ACTUALIZAR CONTADOR
     ================================================ */

  function actualizarContador() {

    const contador =
      document.querySelector('.cart-count');

    if (!contador) return;

    const cantidadTotal =
      carrito.reduce(function (total, producto) {

        return total + Number(producto.cantidad);

      }, 0);

    contador.textContent = cantidadTotal;

    if (cantidadTotal > 0) {
      contador.style.display = 'flex';
    } else {
      contador.style.display = 'none';
    }
  }


  /* ================================================
     MOSTRAR CARRITO
     ================================================ */

  function render() {

    const contenedor =
      document.querySelector('.cart-items');

    const totalElemento =
      document.querySelector('.cart-total-price');

    if (!contenedor) return;


    /* CARRITO VACÍO */

    if (carrito.length === 0) {

      contenedor.innerHTML =
        '<p class="cart-empty">Tu carrito está vacío 🍎</p>';

      if (totalElemento) {
        totalElemento.textContent = '0 Bs.';
      }

      return;
    }


    /* PRODUCTOS */

    let html = '';


    carrito.forEach(function (producto) {

  html +=
    '<div class="cart-item">' +

      '<div class="cart-item-info">' +

        '<strong>' +
          producto.nombre +
        '</strong>' +

        '<span>' +
          producto.precio +
          ' Bs. c/u' +
        '</span>' +

      '</div>' +

      '<div class="cart-item-qty">' +

        '<button ' +
          'type="button" ' +
          'data-menos="' + producto.nombre + '">' +
          '−' +
        '</button>' +

        '<span>' +
          producto.cantidad +
        '</span>' +

        '<button ' +
          'type="button" ' +
          'data-mas="' + producto.nombre + '">' +
          '+' +
        '</button>' +

      '</div>' +

      '<button ' +
        'type="button" ' +
        'class="cart-item-del" ' +
        'data-del="' + producto.nombre + '">' +
        '🗑️' +
      '</button>' +

    '</div>';

});
    contenedor.innerHTML = html;


    /* TOTAL */

    if (totalElemento) {

      totalElemento.textContent =
        calcularTotal() + ' Bs.';

    }

  }


  /* ================================================
     ABRIR CARRITO
     ================================================ */

  function abrirCarrito() {

    const panel =
      document.querySelector('.cart-panel');

    const overlay =
      document.querySelector('.cart-overlay');

    if (panel) {
      panel.classList.add('open');
    }

    if (overlay) {
      overlay.classList.add('show');
    }

  }


  /* ================================================
     CERRAR CARRITO
     ================================================ */

  function cerrarCarrito() {

    const panel =
      document.querySelector('.cart-panel');

    const overlay =
      document.querySelector('.cart-overlay');

    if (panel) {
      panel.classList.remove('open');
    }

    if (overlay) {
      overlay.classList.remove('show');
    }

  }


  /* ================================================
     FINALIZAR PEDIDO
     ================================================ */

  function finalizarPedido() {

    /* Comprobar carrito */

    if (carrito.length === 0) {

      alert('Tu carrito está vacío.');

      return;
    }


    /* Nombre */

    const cliente =
      prompt('Escribe tu nombre:');

    if (!cliente || cliente.trim() === '') {
      return;
    }


    /* Teléfono */

    const telefono =
      prompt('Escribe tu número de teléfono:');

    if (!telefono || telefono.trim() === '') {
      return;
    }


    /* Crear lista de productos */

    let productos = '';


    carrito.forEach(function (producto) {

      const subtotal =
        Number(producto.precio) *
        Number(producto.cantidad);

      productos +=
        '• ' +
        producto.cantidad +
        ' x ' +
        producto.nombre +
        ' - ' +
        subtotal +
        ' Bs.\n';

    });


    /* Crear mensaje */

    const mensaje =
      'Hola MASSIL 🍎\n\n' +
      'Quiero realizar el siguiente pedido:\n\n' +
      productos +
      '\n' +
      'Total: ' +
      calcularTotal() +
      ' Bs.\n\n' +
      'Nombre: ' +
      cliente.trim() +
      '\n' +
      'Teléfono: ' +
      telefono.trim() +
      '\n\n' +
      'Gracias.';


    /* Número de WhatsApp */

    const numeroWhatsApp =
      '59169655369';


    /* Crear URL */

    const urlWhatsApp =
      'https://wa.me/' +
      numeroWhatsApp +
      '?text=' +
      encodeURIComponent(mensaje);


    /* Abrir WhatsApp */

    window.location.href = urlWhatsApp;

  }


  /* ================================================
     EVENTOS
     ================================================ */

  document.addEventListener('click', function (e) {


    /* AGREGAR PRODUCTO */

    const botonAgregar =
      e.target.closest('[data-add-cart]');

    if (botonAgregar) {

      const nombre =
        botonAgregar.dataset.nombre;

      const precio =
        parseFloat(botonAgregar.dataset.precio);

      if (!nombre || isNaN(precio)) {

        alert('Error: producto o precio incorrecto.');

        return;
      }

      agregar({
        nombre: nombre,
        precio: precio
      });

      return;
    }


    /* AUMENTAR */

    const botonMas =
      e.target.closest('[data-mas]');

    if (botonMas) {

      cambiarCantidad(
        botonMas.dataset.mas,
        1
      );

      return;
    }


    /* DISMINUIR */

    const botonMenos =
      e.target.closest('[data-menos]');

    if (botonMenos) {

      cambiarCantidad(
        botonMenos.dataset.menos,
        -1
      );

      return;
    }


    /* ELIMINAR */

    const botonEliminar =
      e.target.closest('[data-del]');

    if (botonEliminar) {

      eliminar(
        botonEliminar.dataset.del
      );

      return;
    }


    /* ABRIR CARRITO */

    const botonCarrito =
      e.target.closest('.cart-toggle');

    if (botonCarrito) {

      abrirCarrito();
      render();

      return;
    }


    /* CERRAR */

    if (
      e.target.closest('.cart-close') ||
      e.target.closest('.cart-overlay')
    ) {

      cerrarCarrito();

      return;
    }


    /* FINALIZAR PEDIDO */

    const botonCheckout =
      e.target.closest('.cart-checkout');

    if (botonCheckout) {

      finalizarPedido();

      return;
    }

  });


  /* ================================================
     INICIAR CARRITO
     ================================================ */

  actualizarContador();
  render();


})();
```
