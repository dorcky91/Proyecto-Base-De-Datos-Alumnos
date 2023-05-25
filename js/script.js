// let formularioIngresar = document.querySelector("#formulario-ingresar");
// formularioIngresar.addEventListener("submit", function(e){
//   const usuario = document.querySelector("#usuario");
//   const contrasena = document.querySelector("#contrasena");
//   console.log("lol");
//e.preventDefault();
//});

const baseDatosMaestros = [
  {
    usuario: "james006",
    password: "1234",
    nombre: "James Jokic",
  },
  {
    usuario: "reaves008",
    password: "5678",
    nombre: "Reaves Beaseley",
  },
  {
    usuario: "maui002",
    password: "9012",
    nombre: "Morgan Garido",
  },
  {
    usuario: "maurico007",
    password: "0134",
    nombre: "Maurico Hernández",
  },
  {
    usuario: "morgue001",
    password: "8976",
    nombre: "Jackson Morgue",
  },
];

//Guardar en localstorage
verificarDatosLocalStorage();
function verificarDatosLocalStorage() {
  let hayDatos = localStorage.getItem("maestros");
  if (hayDatos === null) {
    localStorage.setItem("maestros", JSON.stringify(baseDatosMaestros));
  }
}

//Iniciar Sesión
function iniciarSesion(e) {
  const usuario = document.querySelector("#usuario");
  const contrasena = document.querySelector("#contrasena");

  const baseDeDatosLocal = localStorage.getItem("maestros");
  const arreglo = JSON.parse(baseDeDatosLocal);

  let dato = arreglo.find(
    (x) => x.usuario === usuario.value && x.password === contrasena.value
  );

  if (dato) {
    sessionStorage.setItem("maestroConectado", dato.nombre);
    location.href = "dashboard.html";
  } else {
    alert("Usuario y/o contraseña incorrecto");
  }

  e.preventDefault();
}
