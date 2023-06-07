const getProducts = () => {
    fetch(baseUrl + '/api/products').then(res => {
        res.json().then(json => {
            productos = json.data;
            getUser();
            printProducts();
        })
    })
}
const printProducts = () => {
    let container = document.getElementById('products');
    container.innerHTML = "";
    productos.forEach(producto => {
        container.innerHTML += mapProducts(producto);
    })
}

const mapProducts = (product) => {
    return `<div>
            <h5>${product.name}</h5>
            <p>$${product.price}</p>
            <img src="${product.url}" alt="${product.name}">
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Eliminar</button>
            <button type="button" class="btn btn-warning btn-sm" onclick="populateData('${product._id}')">Actualizar</button>
            </div>
            `

}

const deleteProduct = (productId) => {
    fetch(baseUrl + '/api/products/' + productId, { method: "DELETE" }).then(res => {
        getProducts();
    })
}

const addProduct = () => {
    let data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        url: document.getElementById("url").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
    }
    fetch(baseUrl + '/api/products', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json; charset=UTF-8'
        }
    }).then(res => {
        getProducts();
    })
}

const populateData = (productId) => {
    let product = productos.filter(product => product._id == productId);
    product = product[0];
    document.getElementById("name").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("code").value = product.code;
    document.getElementById("url").value = product.url;
    document.getElementById("price").value = product.price;
    document.getElementById("stock").value = product.stock;
    document.getElementById("productId").value = product._id;
}

const actualizeProduct = () => {
    let data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        url: document.getElementById("url").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        id: document.getElementById("productId").value
    }
    fetch(baseUrl + '/api/products/' + data.id, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json; charset=UTF-8'
        }
    }).then(res => {
        getProducts();
    })
}