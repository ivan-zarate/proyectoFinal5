const productsTo = () => {
    getUrl();
    fetch(baseUrl + 'api/products').then(res => {
        res.json().then(json => {
            productos = json.data;
            printProductsCart()
        })
    })
}
const printProductsCart = () => {
    let container = document.getElementById('products');
    container.innerHTML = "";
    productos.forEach(producto => {
        container.innerHTML += mapProductsCart(producto);
    })
}

const mapProductsCart = (product) => {
    return `<div>
            
            <h5>${product.name}</h5>
            <p>$${product.price}</p>
            <img src="${product.url}" alt="${product.name}">
            <button type="button" class="btn btn-danger btn-sm" onclick="addProductCart('${product._id}')">Agregar</button>
            </div>
            `
}

const addProductCart = (productId) => {
    fetch(baseUrl + 'api/cart-products/' + productId, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json; charset=UTF-8'
        }
    }).then(res => {
    })
}