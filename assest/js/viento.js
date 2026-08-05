// Función para el cálculo del viento
function calculoViento() {
  // Obtenemos el valor ingresado
  const metrosSegundos = parseFloat(document.getElementById("mts_seg").value);
  const mtsSegError = document.getElementById("mts_segError");

  // Validar el valor ingresado
  if (isNaN(metrosSegundos)) {
    mostrarError(mtsSegError, "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Si no hay errores, ocultar los mensajes de error
  ocultarError(mtsSegError);

  // Calculamos la velocidad en kilómetros por hora
  const kilometroViento = metrosSegundos * 3.6;

  // Mostramos el resultado en la página
  document.getElementById("viento").innerHTML =
    `${kilometroViento.toFixed(2)} km/hora`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(metrosSegundos, kilometroViento);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(metrosSegundos, kilometroViento) {
  const procesoDiv = document.getElementById("procesoViento");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmula:</h3>
    <p class="formula">Fórmula = Metros/Segundos * 3.6</p>
    <p class="formula"> = ${metrosSegundos} * 3.6</p>
    <p class="formula">Velocidad ≈ ${kilometroViento.toFixed(2)} km/hora</p>
    `;
  }
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red"; // Cambiado a rojo para mayor visibilidad
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}
