
document.addEventListener('DOMContentLoaded', () => {
  const productosDiv = document.querySelector('[data-product]');
  const urlAPI = "https://alurageek-api-neon.vercel.app/productos"
  let productos = [];

  // Función para obtener los productos del servidor
  async function obtenerProductos() {
    try {
      const response = await fetch(`${urlAPI}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      productos = await response.json();
      mostrarProductos(productos);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Llamar a la función para obtener los productos al cargar la página
  obtenerProductos();

  // Función para mostrar los productos en la página
  function mostrarProductos(productos) {
    productosDiv.innerHTML = '';
    productos.forEach(producto => {
      const productoDiv = document.createElement('div');
      productoDiv.className = "card"
      productoDiv.innerHTML = `
      
      <img class="img-product" src="${producto.imagen}" alt="${producto.nombre}">
      <p class="name-product">${producto.nombre}</p>
      <div class="info-product">
          <p class="price">$ ${producto.precio}</p>
          <button onclick="eliminarProducto(${producto.id})" class="delete-button" >
              <i class="fa-solid fa-trash-can"></i>
          </button>
      </div>
      
      `;
      productosDiv.appendChild(productoDiv);
    });
  }

  // Función para agregar un nuevo producto
  async function postAPI(nuevoProducto) {
    try {
      const response = await fetch(`${urlAPI}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });
      if (!response.ok) {
        throw new Error('Error al agregar el producto');
      }
      const productoAgregado = await response.json();
      productos.push(productoAgregado);
      mostrarProductos(productos);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Manejar el envío del formulario para agregar un nuevo producto
  document.querySelector('[data-form]').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.querySelector('[data-name]').value;
    const precio = document.querySelector('[data-price]').value;
    const imagen = document.querySelector('[data-image]').value;

    const nuevoProducto = {      
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      id: productos.length ? productos[productos.length - 1].id + 1 : 1
    };

    postAPI(nuevoProducto);

    // Resetear el formulario
    document.querySelector('[data-form]').reset();
  });

  // Función para eliminar un producto
 
  async function eliminarProducto(id) {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmar) {
      console.log("hecho")
      try {
        const response = await fetch(`${urlAPI}/${id}`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            "Permissions-Policy": "geolocation=(self `https://alurageek-api-neon.vercel.app/productos`)"
          }
        });
         if (!response.ok) {
          console.log(response.statusText)
           throw new Error('Error al eliminar el producto');
         }
        productos = productos.filter(producto => producto.id !== id);
        mostrarProductos(productos);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
// Hacer la función de eliminación accesible globalmente
  window.eliminarProducto = eliminarProducto;
  
});

