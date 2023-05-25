let listaAlumnos = [];
let listaMaterias = [];
let listaGrupos = [];

class Alumno {
  //Constructor clase alumno
  constructor() {
    this.matricula =
      "000" + Math.random().toString(36).substring(2, 7).toLocaleUpperCase();
  }

  //Dar de alta un alumno
  darDeAltaAlumno(nombre, apellido, edad, objGrupo) {
    var nuevo = {
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      matricula: this.matricula,
      grupo: objGrupo,
      calificacion: 0,
    };

    listaAlumnos.push(nuevo);
    localStorage.setItem("listaAlumnos", JSON.stringify(listaAlumnos));
  }

  //Obtener el alumno con su matricula
  obtenerUnAlumno(matricula) {
    const local = localStorage.getItem("listaAlumnos");
    const arreglo = JSON.parse(local);

    let dato = arreglo.find((alumno) => alumno.matricula == matricula);
    if (dato) {
      return dato;
    }
  }

  inscribirAClase(alumno, clase, calificacion) {}

  //Obtener todos los alumnos
  obtenerTodosLosAlumnos() {
    var local = localStorage.getItem("listaAlumnos");
    if (local == null) {
      listaAlumnos = [];
    } else {
      listaAlumnos = JSON.parse(local);
    }

    return listaAlumnos;
  }
}

class Materia {
  constructor() {}

  //Dar de alta una matería
  darDeAltaMateria(codigo, nombre, objGrupo) {
    const nuevaMateria = {
      codigo: codigo.toLocaleUpperCase(),
      nombre: nombre,
      grupo: objGrupo,
    };

    listaMaterias.push(nuevaMateria);
    localStorage.setItem("listaMaterias", JSON.stringify(listaMaterias));
  }

  //Obtener una materia por su codigo
  obtenerUnaMateria(codigo) {
    const local = localStorage.getItem("listaMaterias");
    const arreglo = JSON.parse(local);

    let dato = arreglo.find((materia) => materia.codigo == codigo);
    if (dato) {
      return dato;
    }
  }

  obtenerMateriasPorGrupo(codigoGrupo) {
    const local = localStorage.getItem("listaMaterias");
    const arreglo = JSON.parse(local);

    let dato = [];
    for (let index = 0; index < arreglo.length; index++) {
      let codigo = arreglo[index].grupo.codigoGrupo;

      if (codigo === codigoGrupo) {
        dato.push({
          codigoMateria: arreglo[index].codigo,
          materia: arreglo[index].nombre,
        });
      }
    }

    return dato;
  }

  //Obtener todas las materias
  obtenerTodasLasMaterias() {
    var local = localStorage.getItem("listaMaterias");
    if (local == null) {
      listaMaterias = [];
    } else {
      listaMaterias = JSON.parse(local);
    }

    return listaMaterias;
  }
}

class Grupo {
  constructor(codigo, nombre) {
    this.codigo = codigo.toLocaleUpperCase();
    this.nombre = nombre;
  }

  //Dar de alta un grupo
  darDeAltaGrupo() {
    const nuevoGrupo = {
      codigo: this.codigo,
      nombre: this.nombre,
    };

    listaGrupos.push(nuevoGrupo);
    localStorage.setItem("listaGrupos", JSON.stringify(listaGrupos));
  }

  //Obtener un grupo por su codigo
  obtenerUnGrupo(codigo) {
    const local = localStorage.getItem("listaGrupos");
    const arreglo = JSON.parse(local);

    let dato = arreglo.find((grupo) => grupo.codigo == codigo);
    if (dato) {
      return dato;
    }
  }

  //Obtener todos los grupos
  obtenerTodosLosGrupos() {
    var local = localStorage.getItem("listaGrupos");
    if (local == null) {
      listaGrupos = [];
    } else {
      listaGrupos = JSON.parse(local);
    }

    return listaGrupos;
  }
}

//Mostrar nombre sensei en sesión
mostrarDatosDashboard();
function mostrarDatosDashboard() {
  var nombreMaestro = document.querySelector("#nombreMaestro");
  if (sessionStorage.getItem("maestroConectado"))
    nombreMaestro.innerHTML = sessionStorage.getItem("maestroConectado");
}

//////////////////////////////////////////////////////////////////////////////
//ALUMNO
//////////////////////////////////////////////////////////////////////////////
function abrirModalAlumno() {
  document.querySelector("#nombre-alumno").value = "";
  document.querySelector("#apellido-alumno").value = "";
  document.querySelector("#edad-alumno").value = "";

  let grupos = document.querySelector("#asignar-grupo-alumno");
  var opcion = "";
  opcion = `<option>Seleccionar un grupo</option>`;

  const local = localStorage.getItem("listaGrupos");
  if (local != null) {
    listaGrupos = JSON.parse(local);
    listaGrupos.forEach((element) => {
      opcion += `<option value="${element.codigo}">${element.nombre}</option>`;
    });
  }

  grupos.innerHTML = opcion;

  const modal = new bootstrap.Modal("#modal-alumno");
  modal.show();
}

function abrirModalMateriaAlumno(matricula) {
  let catedras = document.querySelector("#catedras");
  var opcion = "";

  const alumnoSeleccionado = new Alumno();
  const detalleAlumnoSeleccionado =
    alumnoSeleccionado.obtenerUnAlumno(matricula);
  const codigoGrupoAlumno = detalleAlumnoSeleccionado.grupo.codigoGrupo;
  const materiasAlumnoSeleccionado = new Materia().obtenerMateriasPorGrupo(
    codigoGrupoAlumno
  );

  if (materiasAlumnoSeleccionado.length == 0) {
    //Mostrar sin materia
    opcion = `<div class="col-12">
                <div class="alert alert-danger" role="alert">
                  No hay materia asignada para este alumno y/o este grupo
                </div>
              </div> `;
  } else {
    var i = 0;

    materiasAlumnoSeleccionado.forEach((element) => {
      i++;
      opcion += ` <div class="col-sm-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value="${element.codigoMateria}"
                      id="materia_${i}" />
                    <label class="form-check-label" for="materia_${i}">
                      ${element.materia}
                    </label>
                  </div>
                </div>`;
    });
  }

  catedras.innerHTML = opcion;

  const modal = new bootstrap.Modal("#modal-materias-alumno");
  modal.show();
}

//Guardar alumno después del click del modal agregar alumno
function guardarAlumno(e) {
  let nombre = document.querySelector("#nombre-alumno").value;
  let apellido = document.querySelector("#apellido-alumno").value;
  let edad = document.querySelector("#edad-alumno").value;
  let grupo = document.querySelector("#asignar-grupo-alumno");

  const objGrupo = {
    codigoGrupo: grupo.options[grupo.options.selectedIndex].value,
    nombreGrupo: grupo.options[grupo.options.selectedIndex].text,
  };

  //Instanciar alumno
  const nuevoAlumno = new Alumno();
  nuevoAlumno.darDeAltaAlumno(nombre, apellido, edad, objGrupo);
  nuevoAlumno.obtenerTodosLosAlumnos();
  mostrarAlumnosTabla();

  //Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.querySelector("#modal-alumno")
  );
  modal.hide();

  e.preventDefault();
}

//Mostrar datos de alumnos en la tabla
mostrarAlumnosTabla();
function mostrarAlumnosTabla() {
  let tBody = document.querySelector("#tabla-lista-alumnos tbody");
  var row = "";

  const local = localStorage.getItem("listaAlumnos");
  if (local == null) {
    row = `
        <tr>
         <td class="text-center" colspan="5">Lista de Alumno vacía.</td>
       </tr>`;
  } else {
    listaAlumnos = JSON.parse(local);

    listaAlumnos.forEach((element) => {
      row += `
            <tr>
              <td>${element.matricula}</td>
              <td>${element.grupo.nombreGrupo}</td>
              <td>${element.nombre}</td>
              <td>${element.apellido}</td>
              <td>${element.calificacion}</td>
              <td>
                <a class="d-block"
                  href="#" onclick="abrirModalMateriaAlumno('${element.matricula}')">
                  Asignar materias
                </a>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#calificaciones-alumno">
                  Agregar calificaciones
                </a>
              </td>
            </tr>`;
    });
  }
  tBody.innerHTML = row;
}

//////////////////////////////////////////////////////////////////////////////
//MATERIA
//////////////////////////////////////////////////////////////////////////////
function abrirModalMaterias() {
  document.querySelector("#codigo-materia").value = "";
  document.querySelector("#nombre-materia").value = "";

  let grupos = document.querySelector("#grupo-materia");
  var opcion = "";
  opcion = `<option>Seleccionar un grupo</option>`;

  const local = localStorage.getItem("listaGrupos");
  if (local != null) {
    listaGrupos = JSON.parse(local);
    listaGrupos.forEach((element) => {
      opcion += `<option value="${element.codigo}">${element.nombre}</option>`;
    });
  }

  grupos.innerHTML = opcion;

  const modal = new bootstrap.Modal("#modal-materia");
  modal.show();
}

function guardarMateria(e) {
  let codigo = document.querySelector("#codigo-materia");
  let nombre = document.querySelector("#nombre-materia");
  let grupo = document.querySelector("#grupo-materia");

  const objGrupo = {
    codigoGrupo: grupo.options[grupo.options.selectedIndex].value,
    nombreGrupo: grupo.options[grupo.options.selectedIndex].text,
  };

  //Instanciar materia
  const nuevaMateria = new Materia();
  nuevaMateria.darDeAltaMateria(codigo.value, nombre.value, objGrupo);
  nuevaMateria.obtenerTodasLasMaterias();
  mostrarMateriasTabla();

  //Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.querySelector("#modal-materia")
  );
  modal.hide();

  e.preventDefault();
}

//Mostrar materias en la tabla
mostrarMateriasTabla();
function mostrarMateriasTabla() {
  let tBody = document.querySelector("#tabla-lista-materias tbody");
  let row = "";

  const local = localStorage.getItem("listaMaterias");
  if (local == null) {
    row = `
      <tr>
        <td class="text-center" colspan="4">Lista de materia vacía.</td>
      </tr>`;
  } else {
    listaMaterias = JSON.parse(local);

    listaMaterias.forEach((element) => {
      row += `
            <tr>
              <td>${element.codigo}</td>
              <td>${element.nombre}</td>
              <td>${element.grupo.nombreGrupo}</td>
              <td>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#calificaciones-alumno">
                  lol
                </a>
              </td>
            </tr>`;
    });
  }
  tBody.innerHTML = row;
}

//////////////////////////////////////////////////////////////////////////////
//GRUPO
//////////////////////////////////////////////////////////////////////////////
function guardarGrupo(e) {
  let codigo = document.querySelector("#codigo-grupo");
  let nombre = document.querySelector("#nombre-grupo");

  //Instanciar grupo
  const nuevoGrupo = new Grupo(codigo.value, nombre.value);
  nuevoGrupo.darDeAltaGrupo();
  nuevoGrupo.obtenerTodosLosGrupos();
  mostrarGruposTabla();

  //Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.querySelector("#modal-grupo")
  );
  modal.hide();

  e.preventDefault();
}

//Mostrar grupos en la tabla
mostrarGruposTabla();
function mostrarGruposTabla() {
  let tBody = document.querySelector("#tabla-lista-grupos tbody");
  let row = "";

  const local = localStorage.getItem("listaGrupos");
  if (local == null) {
    row = `
      <tr>
        <td class="text-center" colspan="3">Lista de grupo vacía.</td>
      </tr>`;
  } else {
    listaGrupos = JSON.parse(local);

    listaGrupos.forEach((element) => {
      row += `
            <tr>
              <td>${element.codigo}</td>
              <td>${element.nombre}</td>
              <td>90/100</td>
              <td>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#calificaciones-alumno">
                  lol
                </a>
              </td>
            </tr>`;
    });
  }
  tBody.innerHTML = row;
}
