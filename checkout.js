// Cargar el método de entrega guardado
document.getElementById('pickupOption').value = localStorage.getItem('pickupOption') || "Local";

document.addEventListener("DOMContentLoaded", function () {
    let subtotal = localStorage.getItem('subtotal') || "0";
    document.getElementById('subtotal').innerText = `$${subtotal}`;
});

function proceedToPayment() {
    let email = document.getElementById('email').value.trim();
    let name = document.getElementById('name').value.trim();
    let surname = document.getElementById('surname').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let pickupOption = document.getElementById('pickupOption').value;

    if (!email || !name || !surname || !phone) {
        alert("Por favor, completá todos los campos antes de continuar.");
        return;
    }

    // Guardar los datos antes de redirigir
    localStorage.setItem('buyerInfo', JSON.stringify({ email, name, surname, phone, pickupOption }));

    // Inicializar Mercado Pago con tu clave pública
    const mp = new MercadoPago('TU_CLAVE_PUBLICA', { 
        locale: 'es-AR' 
    });

    // Crear la preferencia de pago con el subtotal calculado
    fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer TU_ACCESS_TOKEN' // Usar tu Access Token
        },
        body: JSON.stringify({
            items: [
                {
                    title: "Compra en Tienda",
                    unit_price: parseFloat(subtotal), // Usando el subtotal calculado
                    quantity: 1
                }
            ],
            back_urls: {
                success: "http://tusitio.com/success", // Cambiar por tu URL de éxito
                failure: "http://tusitio.com/failure", // Cambiar por tu URL de error
                pending: "http://tusitio.com/pending"  // Cambiar por tu URL de pendiente
            },
            auto_return: "approved"
        })
    })
    .then(response => response.json())
    .then(data => {
        const preferenceId = data.id;
        // Redirigir al usuario al checkout de Mercado Pago
        mp.checkout({
            preference: {
                id: preferenceId
            }
        });
    })
    .catch(error => console.error('Error al crear la preferencia:', error));
}
