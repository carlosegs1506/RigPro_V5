// Función para calcular la capacidad del grillete
function capacidadOrejaMontaje() {
  // Obtener y parsear los valores ingresados
  const gramilOreja = parseFloat(document.getElementById("gramil").value);
  const espesorOreja = parseFloat(document.getElementById("espesor").value);

  // Inicializar los elementos de error
  const gramilError = document.getElementById("gramilError");
  const espesorError = document.getElementById("espesorError");

  // Validar los valores ingresados y mostrar mensajes de error
  const errores = [
    { campo: gramilOreja, elemento: gramilError, mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: espesorOreja, elemento: espesorError, mensaje: "Por favor, ingresa un valor numérico válido." }
  ];

  // Mostrar el primer mensaje de error y ocultar los demás
  const errorEncontrado = mostrarErrores(errores);

  // Si hay errores, salir de la función
  if (errorEncontrado) return;

  // Si no hay errores, ocultar los mensajes de error
  ocultarError(gramilError);
  ocultarError(espesorError);

  // Calcular el resultado
  const resultadoOreja = gramilOreja * espesorOreja * 12.5;

  // Mostrar el resultado en la página
  document.getElementById("capacidadOreja").innerHTML = `${resultadoOreja.toFixed(1)} Kg`;

  // Mostrar la fórmula y el desarrollo en pantalla
  mostrarFormulaDesarrollo(gramilOreja, espesorOreja, resultadoOreja);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarFormulaDesarrollo(gramilOreja, espesorOreja, resultadoOreja) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <<h3>Proceso y Fórmula:</h3>
      <p class="formula">Fórmula = Gramil * Espesor * Constante (12.5)</p>
      <p class="formula"> = ${gramilOreja} * ${espesorOreja} * ${12.5}</p>
      <p class="formula">Capacidad ≈ ${resultadoOreja.toFixed(1)} Kg</p>
    `;
  }

  // Mostrar el div de la imagen
     mostrarImagen();
}

// Función para mostrar la imagen del proceso
function mostrarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  if (imagenProcesoDiv) {
    imagenProcesoDiv.style.display = "block";
  }
}

// Función para ocultar la imagen de proceso
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  if (imagenProcesoDiv) {
    imagenProcesoDiv.style.display = "none";
  }
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.style.color = "red";
  }
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  if (elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  }
}

// Función para mostrar el primer mensaje de error y ocultar los demás
function mostrarErrores(errores) {
  let errorEncontrado = false;

  // Ocultar todos los mensajes de error
  errores.forEach(error => {
    ocultarError(error.elemento);
  });

  // Mostrar el primer mensaje de error
  for (const error of errores) {
    if (isNaN(error.campo)) {
      mostrarError(error.elemento, error.mensaje);
      errorEncontrado = true;
      break; // Salir después de mostrar el primer error
    }
  }

  return errorEncontrado;
}
