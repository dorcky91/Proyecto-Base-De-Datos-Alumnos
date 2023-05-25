let listaAlumnos = [];

class Alumno {
  darDeAltaAlumno(matricula, nombre, apellido, edad) {
    let nuevoAlumno = {
      matricula: matricula,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      listaMaterias: [],
    };
    console.log(nuevoAlumno);
    listaAlumnos.push(nuevoAlumno);
    localStorage.setItem("listaAlumnos", JSON.stringify(listaAlumnos));
  }

  buscarAlumno(matricula) {
    let alumnoEncontrado = listaAlumnos.find(
      (alumno) => alumno.matricula == matricula
    );
    return alumnoEncontrado;
  }

  asignarMateriaAlumno(alumnoObj, codigo, nombre) {
    let nuevaMateria = {
      codigo: codigo,
      nombre: nombre,
      calificacion: 0,
    };

    let indice = listaAlumnos.indexOf(alumnoObj);
    alumnoObj.listaMaterias.push(nuevaMateria);
    listaAlumnos[indice] = alumnoObj;
    localStorage.setItem("listaAlumnos", JSON.stringify(listaAlumnos));
  }

  asignarCalificacionAlumno(alumnoObj, materiaObj, calificacion) {
    let indiceAlumno = listaAlumnos.indexOf(alumnoObj);
    let indiceMateria = alumnoObj.listaMaterias.indexOf(materiaObj);
    let nuevaMateria = {
      codigo: materiaObj.codigo,
      nombre: materiaObj.nombre,
      calificacion: parseInt(calificacion),
    };

    if (indiceMateria > -1) {
      // only splice array when item is found
      alumnoObj.listaMaterias.splice(indiceMateria, 1);
      // 2nd parameter means remove one item only

      alumnoObj.listaMaterias.push(nuevaMateria);
      listaAlumnos[indiceAlumno] = alumnoObj;
      localStorage.setItem("listaAlumnos", JSON.stringify(listaAlumnos));
    }
  }
}

//Mostrar nombre sensei en sesión
mostrarDatosDashboard();
function mostrarDatosDashboard() {
  var nombreMaestro = document.querySelector("#nombreMaestro");
  if (sessionStorage.getItem("maestroConectado"))
    nombreMaestro.innerHTML = sessionStorage.getItem("maestroConectado");
}

function abrirModalAlumno() {
  document.querySelector("#nombre-alumno").value = "";
  document.querySelector("#apellido-alumno").value = "";
  document.querySelector("#edad-alumno").value = "";
  document.querySelector("#matricula-alumno").value = "";

  const modal = new bootstrap.Modal("#modal-alumno");
  modal.show();
}

document
  .querySelector("#formulario-alta-alumno")
  .addEventListener("submit", agregarNuevoAlumno, true);

function agregarNuevoAlumno(e) {
  let matricula = document.querySelector("#matricula-alumno"),
    nombre = document.querySelector("#nombre-alumno"),
    apellido = document.querySelector("#apellido-alumno"),
    edad = document.querySelector("#edad-alumno");

  const nuevoAlumno = new Alumno();
  nuevoAlumno.darDeAltaAlumno(
    matricula.value,
    nombre.value,
    apellido.value,
    edad.value
  );

  //Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.querySelector("#modal-alumno")
  );
  modal.hide();

  mostrarDatosAlumnosEnTabla();
  e.preventDefault();
}

mostrarDatosAlumnosEnTabla();
function mostrarDatosAlumnosEnTabla() {
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
              <td>${element.nombre}</td>
              <td>${element.apellido}</td>
              <td>${element.edad}</td>
              <td>
                <a
                  href="#" onclick="abrirModalMaterias('${element.matricula}')">
                  Asignar materias
                </a>
              </td>
            </tr>`;
    });
  }

  tBody.innerHTML = row;
  mostrarListaMateriasEnTabla();
}

function abrirModalMaterias(matricula) {
  document.querySelector("#codigo-materia").value = "";
  document.querySelector("#nombre-materia").value = "";
  document.querySelector("#trampa-matricula").value = matricula;

  const modal = new bootstrap.Modal("#modal-materia");
  modal.show();
}

document
  .querySelector("#formulario-asignar-materias")
  .addEventListener("submit", agregarMateria, true);
function agregarMateria(e) {
  let codigo = document.querySelector("#codigo-materia"),
    matricula = document.querySelector("#trampa-matricula"),
    nombre = document.querySelector("#nombre-materia");

  let dato = new Alumno();
  let alumnoObj = dato.buscarAlumno(matricula.value);
  dato.asignarMateriaAlumno(alumnoObj, codigo.value, nombre.value);

  //Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.querySelector("#modal-materia")
  );
  modal.hide();
  mostrarListaMateriasEnTabla();

  e.preventDefault();
}

mostrarListaMateriasEnTabla();
function mostrarListaMateriasEnTabla() {
  let tBody = document.querySelector("#tabla-lista-materias tbody");
  let row = "";
  var cantidadMaterias = 0;

  const local = localStorage.getItem("listaAlumnos");
  if (local != null) {
    listaAlumnos = JSON.parse(local);

    listaAlumnos.forEach((element) => {
      cantidadMaterias += element.listaMaterias.length;

      element.listaMaterias.forEach((e) => {
        row += `
            <tr>
              <td>${e.codigo}</td>
              <td>${e.nombre}</td>
              <td>${element.nombre} ${element.apellido}</td>
              <td>${e.calificacion}</td>
              <td>
                <a
                  href="#" onclick="abrirModalCalificacion('${e.codigo}',
                  '${e.nombre}','${element.matricula}', '${element.nombre} ${element.apellido}')">
                  Asignar calificación
                </a>
              </td>
            </tr>`;
      });
    });
  }

  if (cantidadMaterias == 0) {
    row = `
      <tr>
         <td class="text-center" colspan="5">Lista de Materia vacía.</td>
      </tr>`;
  }

  tBody.innerHTML = row;
}

function abrirModalCalificacion(
  codigoMateria,
  nombreMateria,
  matriculaAlumno,
  nombreAlumno
) {
  document.querySelector("#matricula-alumno-calif").value = matriculaAlumno;
  document.querySelector("#nombre-alumno-calif").value = nombreAlumno;
  document.querySelector("#cod-materia-alumno-calif").value = codigoMateria;
  document.querySelector("#materia-alumno-calif").value = nombreMateria;
  document.querySelector("#calificacion-alumno").value = "";

  const modal = new bootstrap.Modal("#modal-calificaciones");
  modal.show();
}

document
  .querySelector("#formulario-asignar-calificacion")
  .addEventListener("submit", asignarCalificacion, true);
function asignarCalificacion(e) {
  let matriculaAlumno = document.querySelector("#matricula-alumno-calif"),
    codigoMateria = document.querySelector("#cod-materia-alumno-calif"),
    calificacion = document.querySelector("#calificacion-alumno");

  let dato = new Alumno();
  let alumnoObj = dato.buscarAlumno(matriculaAlumno.value);
  let materiaObj = alumnoObj.listaMaterias.find(
    (x) => x.codigo == codigoMateria.value
  );

  dato.asignarCalificacionAlumno(alumnoObj, materiaObj, calificacion.value);

  //Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.querySelector("#modal-calificaciones")
  );
  modal.hide();

  mostrarListaMateriasEnTabla();
  e.preventDefault();
}
