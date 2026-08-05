// Función para el cálculo del volumen
function calcularVolumen() {
  // Obtenemos los valores de los campos del formulario
  const largo = parseFloat(document.getElementById("largo").value);
  const ancho = parseFloat(document.getElementById("ancho").value);
  const alto = parseFloat(document.getElementById("alto").value);

  // Referencias a elementos de error
  const largoError = document.getElementById("largoError");
  const anchoError = document.getElementById("anchoError");
  const altoError = document.getElementById("altoError");

  // Validamos los valores ingresados
  if (isNaN(largo)) {
    mostrarError(largoError, "Por favor, ingresa un valor numérico válido.");
    return;
  } else {
    ocultarError(largoError);
  }

  if (isNaN(ancho)) {
    mostrarError(anchoError, "Por favor, ingresa un valor numérico válido.");
    return;
  } else {
    ocultarError(anchoError);
  }

  if (isNaN(alto)) {
    mostrarError(altoError, "Por favor, ingresa un valor numérico válido.");
    return;
  } else {
    ocultarError(altoError);
  }

  // Calculamos el volumen
  const volumen = largo * ancho * alto;

  // Mostramos el resultado en la página
  document.getElementById("volumen").innerHTML = `${volumen.toFixed(2)} m<sup>3</sup>`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(largo, ancho, alto, volumen);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(largo, ancho, alto, volumen) {
  const procesoDiv = document.getElementById("procesoVolumen");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p class="formula">Fórmula = Largo * Ancho * Alto</p>
    <p class="formula"> = ${largo} * ${ancho} * ${alto}</p>
    <p class="formula">Volumen ≈ ${volumen.toFixed(2)} m<sup>3</sup></p>
    `;
  }

   // Mostrar el div de la imagen
   const imagenProcesoDiv = document.getElementById("imagenProceso");
   imagenProcesoDiv.style.display = "block";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  imagenProcesoDiv.style.display = "none";
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red"; // Cambiado a rojo para mayor visibilidad
  
  // Ocultar el div de la imagen en caso de error
  ocultarImagen();
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}
