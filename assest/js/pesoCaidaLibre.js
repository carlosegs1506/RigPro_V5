// Función para calcular el peso en caída libre
function calculoCaidaLibre() {
  // Obtener los valores de los campos del formulario
  const pesoMaterialCaida = parseFloat(document.getElementById("peso").value);
  const alturaCaida = parseFloat(document.getElementById("altura").value);

  // Inicializar los elementos de error
  const errores = [
    { campo: pesoMaterialCaida, elemento: "pesoError", mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: alturaCaida, elemento: "alturaError", mensaje: "Por favor, ingresa un valor numérico válido." }
  ];

  // Mostrar el primer mensaje de error y ocultar los demás
  const errorEncontrado = mostrarErrores(errores);

  // Si hay errores, salir de la función
  if (errorEncontrado) return;

  // Calcular las variables necesarias
  const resultadoPesoCaida = pesoMaterialCaida * alturaCaida * 9.8;

  // Mostrar el resultado en la página
  document.getElementById("caidaLibre").innerHTML = `${resultadoPesoCaida.toFixed(1)} Kg`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(pesoMaterialCaida, alturaCaida, resultadoPesoCaida);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(pesoMaterialCaida, alturaCaida, resultadoPesoCaida) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Fórmula y Desarrollo:</h3>
      <p class="formula">Fórmula = Peso * Altura * Constante (9.8)</p>
      <p class="formula"> = ${pesoMaterialCaida} * ${alturaCaida} * ${9.8}</p>
      <p class="formula">Peso ≈ ${resultadoPesoCaida.toFixed(2)} kg</p>
    `;
  }

  // Mostrar el div de la imagen
  const imagenProcesoDiv = document.getElementById("imagenProceso");
    if (imagenProcesoDiv) {
      imagenProcesoDiv.style.display = "block";
}}

// Función para mostrar un mensaje de error en un elemento
function mostrarError(elementoId, mensaje) {
  const errorElement = document.getElementById(elementoId);
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.style.color = "red";
  }
}

// Función para ocultar un mensaje de error
function ocultarError(elementoId) {
  const errorElement = document.getElementById(elementoId);
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
document.querySelector(".enviar").addEventListener("click", calculoCaidaLibre);

