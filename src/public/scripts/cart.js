const productsInCart = () => {
    getUser();
    fetch(baseUrl + '/api/cart-products/:_id').then(res => {
        res.json().then(json => {
            let container = document.getElementById('noUser');
            if (json.empty) {
                container.innerHTML = `<h4>Aun no estas registrado</h4>
                                        <p>Para acceder a nuestros productos puedes <a href="signup.html">Registrarte</a> o bien <a href="login.html">Loguearte</a></p>
                                        <h5>!Muchas gracias por visitarnos!</h5>`
            }
            else {
                if (json.status === "error") {
                    createCart()
                }
                if (json.message) {
                    container.innerHTML = `${json.message}`;
                }
                else {
                    productos = json.data.products;
                    printCartProducts(json.data._id);
                }
            }
        })
    })
}

const printCartProducts = (id) => {
    let container = document.getElementById('cartProducts');
    container.innerHTML = "";
    drawTitles();
    productos.forEach(producto => {
        container.innerHTML += mapCartProducts(producto);
    })
    totalAPagar(id);
}

const drawTitles = () => {
    let titleContainer = document.getElementById('titulos');
    return titleContainer.innerHTML = `
        <h4>Productos</h4>
        <h4>Precio</h4>
        <h4>Cantidad</h4>
        <h4>Imagen</h4>
        <h4>Eliminar</h4>
    `;
}

const mapCartProducts = (product) => {
    return `
    <div>
        <h6>${product.name}</h6>
        <p>$${product.price}</p>
        <section class="amount">
            <a onclick="editAmount('${product._id}','del')"><img style="height:2.5em" src="images/nuevoMenos.png" alt="signo menos"></a>
            <p>${product.amount}</p>
            <a onclick="editAmount('${product._id}','add')"><img style="height:2.5em" src="images/nuevoMas.png" alt="signo mas"></a>
        </section>
        <img class="productInCart" src="${product.url}" alt="${product.name}">
        <a onclick="deleteItem('${product._id}')"><img style="height:4em" src="images/basura.png" alt="tacho de basura"></a>
    </div>`
}

const editAmount = (productId, query) => {
    fetch(baseUrl + '/api/cart-products/' + productId + '?query=' + query, {
        method: "PUT",
        headers: {
            "Content-Type": 'application/json; charset=UTF-8'
        }
    }).then(res => {
        res.json().then(json => {
            productsInCart();
            totalAPagar();
            productStock();
        })
    })
}
const deleteItem = (productId) => {
    fetch(baseUrl + '/api/cart-products/' + productId, {
        method: "DELETE",
        headers: {
            "Content-Type": 'application/json; charset=UTF-8'
        }
    }).then(res => {
        cleanCart();
        productsInCart();
        productStock();
    })
}

const cleanCart=()=>{
    let container = document.getElementById('cartProducts');
    container.innerHTML = "";
    let titleContainer = document.getElementById('titulos');
    titleContainer.innerHTML = "";
    let containerPago = document.getElementById('totalAPagar');
    containerPago.innerHTML = "";
}

const totalAPagar = (id) => {
    let container = document.getElementById('totalAPagar');
    const total = productos.reduce((acc, product) => acc + (product.price * product.amount), 0)
    container.innerHTML = `
    <p>Total a pagar $${total}</p>
    <button type="button" onclick="finalizarCompra('${id}')">Finalizar compra</button>
    `
}

finalizarCompra = (id) => {
    if (!user) {
        console.log("user", user);
        const finalizar = document.querySelector('.finalizarCompra')
        finalizar.innerHTML = `Para continuar con la compra primero debe <a href="signup.html">registrarse</a> o <a href="login.html">iniciar sesion</a>`
    }
    else {
        fetch(baseUrl + '/api/sells/' + id, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json; charset=UTF-8'
            },
        }).then(res => {
            res.json().then(json => {
                if (json.data.length > 0) {
                    productStock(json.data);
                }
                console.log(json);
                createCart();
                //location.href = "compraFinalizada.html";
            })
        })
    }

}

productStock = (data) => {
    let container = document.getElementById('noStock');
    if (!data) {
        container.innerHTML = '';
    }
    else {
        container.innerHTML = '';
        data.forEach(producto => {
            container.innerHTML += outOfStock(producto);
        })
    }
}

const outOfStock = (producto) => {
    return `<p>Ya no contamos con la cantidad ingresada para <strong>${producto.name}, stock actual ${producto.stock}</strong></p> `
}