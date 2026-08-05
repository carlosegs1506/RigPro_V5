// Función para calcular el peso de un perfil ángulo
function calculoPerfilAngulo() {
  // Obtener los valores de los campos del formulario
  const alto = parseFloat(document.getElementById("alto").value);
  const largo = parseFloat(document.getElementById("largo").value);
  const espesor = parseFloat(document.getElementById("espesor").value);
  const especifico = parseFloat(document.getElementById("especifico").value);

  // Inicializar los elementos de error
  const errores = [
    { campo: alto, elemento: "altoError", mensaje: "Por favor, ingrese un valor numérico válido." },
    { campo: largo, elemento: "largoError", mensaje: "Por favor, ingrese un valor numérico válido." },
    { campo: espesor, elemento: "espesorError", mensaje: "Por favor, ingrese un valor numérico válido." },
    { campo: especifico, elemento: "especificoError", mensaje: "Por favor, ingrese un valor numérico válido." }
  ];

  // Mostrar el primer mensaje de error y ocultar los demás
  const errorEncontrado = mostrarErrores(errores);

  // Si hay errores, salir de la función
  if (errorEncontrado) return;

  // Convertimos el peso específico de toneladas métricas a kilogramos por metro cúbico
  const especificoKgM3 = especifico * 1000;

  // Área de la sección transversal (Alto y Espesor en mm, convertida a m²) * Largo en metros
  const volumen = ((alto * espesor * 2) / 1000000) * largo;
  const pesoKg = volumen * especificoKgM3;
  const pesoTon = pesoKg / 1000;

  // Mostrar el resultado en pantalla
  document.getElementById("perfilA").innerHTML = `${pesoKg.toFixed(2)} kg / ${pesoTon.toFixed(2)} ton`;

  // Mostrar la fórmula y el desarrollo en pantalla
  mostrarProceso(alto, largo, espesor, especifico, volumen, pesoKg, pesoTon);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(alto, largo, espesor, especifico, volumen, pesoKg, pesoTon) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmula:</h3>
      <p class="formula">Peso Específico = ${especifico} toneladas/m³ * 1000 = ${especifico * 1000} kg/m³</p>
      <p class="formula">Volumen = (Alto * Espesor * 2 / 1.000.000) * Largo</p>
      <p class="formula"> = (${alto} * ${espesor} * 2 / 1.000.000) * ${largo} = ${volumen.toFixed(9)} m³</p>
      <p>4. Calculamos el peso:</p>
      <p class="formula">Peso ≈ Volumen * Peso Específico</p>
      <p class="formula">Peso ≈ ${volumen.toFixed(9)} * ${especifico * 1000} = ${pesoKg.toFixed(2)} kg / ${pesoTon.toFixed(2)} ton</p>
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
  const errorElement = document.getElementById(elemento);
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.style.color = "red";
  }
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  const errorElement = document.getElementById(elemento);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.color = "initial";
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

// Ejecutar la función cuando se hace clic en el botón
document.querySelector(".enviar").addEventListener("click", calculoPerfilAngulo);
