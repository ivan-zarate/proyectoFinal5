//let baseUrl = "http://localhost:8080"
//let baseUrl='https://proyectofinal5-production.up.railway.app' ;
let baseUrl=[];

let productos = [];
let user = [];
let errors = [];

const getUrl=()=>{
    fetch('/').then(res=>{
        getUser(res.url)
    })
}

const getUser = (url) => {
    baseUrl=url
    fetch(baseUrl + 'api/getusers').then(res => {
        res.json().then(json => {
            user = json;
            printUser(user);
        })
    })
}

const printUser = (user) => {
    if (user.message) {
        console.log(user.message);
        container = document.getElementById('user').style.display = "none";
    }
    else {
        if (user.data.admin) {
            let adminContainer = document.getElementById('admin');
            adminContainer.innerHTML = `Admin`

        }
        let container = document.getElementById('user');
        container.innerHTML =
            `<div>
        <p>¡Hola ${user.data.username}!</p>
        <button type="button" class="btn btn-danger btn-sm" onclick="destroySession()">LogOut</button>
        </div>`
    }
}

const destroySession = () => {
    fetch(baseUrl + 'api/logout', { method: "DELETE" }).then(res => {
        user = [];
        location.href = "/";
    })
}

