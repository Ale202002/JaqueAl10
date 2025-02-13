function openModal() {
    document.getElementById('searchModal').style.display = 'flex';
}

function closeModal(event) {
    if (event) event.stopPropagation();
    document.getElementById('searchModal').style.display = 'none';
}

function openCartModal() {
    document.getElementById('cartModal').style.display = 'flex';
    mostrarCarrito(); // Muestra el carrito actualizado
}

function closeCartModal(event) {
    if (event) event.stopPropagation();
    document.getElementById('cartModal').style.display = 'none';
}

// Guardar el carrito en localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar el carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
}

// Agregar producto al carrito
function addToCart(product) {
    let cart = loadCart();

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.name === product.name && item.size === product.size);

    if (existingProductIndex !== -1) {
        // Si ya existe, incrementar la cantidad
        cart[existingProductIndex].quantity += 1;
    } else {
        // Si no existe, agregar el producto al carrito con cantidad 1
        product.quantity = 1;
        cart.push(product);
    }

    saveCart(cart);
    updateCartCount();
    showCart();
}

// Actualizar el contador del carrito en el ícono
function updateCartCount() {
    let cart = loadCart();
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Mostrar los productos en el carrito
function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartContent = cartModal.querySelector('.modal-content');
    let cart = loadCart();

    // Limpiar contenido previo del carrito
    cartContent.innerHTML = `<h2>Carrito de Compras</h2>`;

    if (cart.length === 0) {
        cartContent.innerHTML += `<p>Tu carrito está vacío.</p>`;
    } else {
        cart.forEach((product, index) => {
            cartContent.innerHTML += `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}" width="50">
                    <p>${product.name}</p>
                    <p>${product.size}</p>
                    <p>$${product.price}</p>
                    <p>Cantidad: ${product.quantity}</p>
                    <button onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            `;
        });

        // Calcular el subtotal
        let subtotal = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
        localStorage.setItem('subtotal', subtotal.toFixed(2)); // Guardar el subtotal en localStorage
        cartContent.innerHTML += `
    <hr>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
`;

        // Agregar el selector de punto de retiro
        cartContent.innerHTML += `
<hr>
<label for="pickupOption"><strong>Punto de Retiro:</strong></label>
<select id="pickupOption" onchange="updatePickupOption()">
    <option value="local">Local</option>
    <option value="punto_encuentro">Punto de Encuentro</option>
</select>

<br><br>

    <button onclick="checkout()">Iniciar Compra</button>
`;

        // Cargar la opción guardada
        let savedPickupOption = localStorage.getItem('pickupOption');
        if (savedPickupOption) {
            document.getElementById('pickupOption').value = savedPickupOption;
        }

    }

    cartContent.innerHTML += `<button class="close-btn" onclick="closeCartModal(event)">Cerrar</button>`;
}

// Guardar la opción de punto de retiro en localStorage
function updatePickupOption() { 
    let pickupOption = document.getElementById('pickupOption').value;
    localStorage.setItem('pickupOption', pickupOption);
}

// Redirigir a Mercado Pago para el pago
function checkout() {
    let pickupOption = document.getElementById('pickupOption').value;
    localStorage.setItem('pickupOption', pickupOption); // Guardamos la opción de retiro
    window.location.href = "checkout.html"; // Redirige al formulario
}




// Eliminar un producto del carrito
function removeFromCart(index) {
    let cart = loadCart();
    cart.splice(index, 1);  // Eliminar el producto en la posición especificada
    saveCart(cart);
    updateCartCount();
    showCart();
}

// Abrir modal del carrito
function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    const modalOverlay = document.getElementById('modalOverlay');
    cartModal.style.display = 'block';
    modalOverlay.style.display = 'block';  // Mostrar fondo
    showCart();
}

// Cerrar modal del carrito
function closeCartModal(event) {
    const cartModal = document.getElementById('cartModal');
    const modalOverlay = document.getElementById('modalOverlay');
    cartModal.style.display = 'none';
    modalOverlay.style.display = 'none';  // Ocultar fondo
}

// Escuchar los botones "Agregar al carrito"
document.querySelectorAll('.agregar-carrito').forEach((button, index) => {
    button.addEventListener('click', function () {
        const item = button.previousElementSibling;
        const name = item.querySelector('p').textContent;
        const price = parseFloat(item.querySelector('.precio').textContent.replace('$', '').replace('.', '').trim());
        const size = item.querySelector('.talle').value;
        const image = item.querySelector('img').src;

        const product = { name, price, size, image };
        addToCart(product);
    });
});

// Cargar el carrito al inicio
updateCartCount();




