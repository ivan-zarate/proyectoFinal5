const addUser = async () => {
    user = [];
    let data = {
        username: document.getElementById("email").value,
        password: document.getElementById("password").value,
        name: document.getElementById("name").value,
        addres: document.getElementById("addres").value,
        age: document.getElementById("age").value,
        telphone: document.getElementById("telphone").value,
        avatar: document.getElementById("avatar").value,
    }
    await fetch(baseUrl + '/api/signup', {
        method: "POST",
        headers: {
            "Content-Type": 'application/json; charset=UTF-8'
        },
        credentials: "include",
        body: JSON.stringify(data),
    })
        .then(res => {
            if (res.url == "http://localhost:8080/errores") {
                getErrors();
            }
            else {
                res.json().then(json => {
                    if (json) {
                        createCart();
                    }
                })
            }
        })
        .catch(err => {
            return({error:err})
        })
}

const loginUser = async () => {
    user = [];
    let data = {
        username: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }
    await fetch(baseUrl + '/api/login', {
        method: "POST",
        headers: {
            "Content-Type": 'application/json; charset=UTF-8'
        },
        credentials: "include",
        body: JSON.stringify(data),
    })
        .then(res => {
            if (res.url == "http://localhost:8080/errores") {
                getErrors();
            }
            else {
                res.json().then(json => {
                    if (json) {
                        createCart();
                    }
                })
            }
        })
        .catch(err => {
            return({error:err})
        })
}

const createCart = async () => {
    await fetch(baseUrl + '/api/getCart').then(res => {
        res.json().then(json => {
            if (json) {
                location.href = "index.html"
            }
        })
    })
}

const getErrors = async () => {
    await fetch(baseUrl + '/api/errores').then(res => {
        res.json().then(json => {
            errors = json.error;
            printErrors();
        })
    })
}

const printErrors = () => {
    let error = document.getElementById("error");
    error.innerHTML = `${errors}`;
}