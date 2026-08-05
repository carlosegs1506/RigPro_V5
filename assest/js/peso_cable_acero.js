// Función para calcular el peso de un cable de acero
function calcularPesoCable() {
  // Obtener los valores de los campos del formulario
  const diametro = parseFloat(document.getElementById("diametro").value);
  const largo = parseFloat(document.getElementById("largo").value);
  const pesoEspecifico = parseFloat(document.getElementById("peso").value);

  // Inicializar los elementos de error
  const errores = [
    { campo: diametro, elemento: "diametroError", mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: largo, elemento: "largoError", mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: pesoEspecifico, elemento: "pesoError", mensaje: "Por favor, ingresa un valor numérico válido para el peso específico." }
  ];

  // Mostrar el primer mensaje de error y ocultar los demás
  const errorEncontrado = mostrarErrores(errores);

  // Si hay errores, salir de la función
  if (errorEncontrado) return;

  // Fórmula: Diámetro² x π x Largo ÷ 4 x Peso Específico
  const volumen = (Math.pow(diametro, 2) * Math.PI * largo) / 4;
  const resultadoPesoCable = volumen * pesoEspecifico;
  const resultadoTotal = resultadoPesoCable * 1000;

  // Mostrar el resultado en la página
  document.getElementById("cableAcero").innerHTML = `${resultadoTotal.toFixed(1)} Kg`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(diametro, largo, pesoEspecifico, resultadoTotal);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametro, largo, pesoEspecifico, resultadoTotal) {
  const procesoDiv = document.getElementById("procesoDesarrollo");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Fórmula y Desarrollo:</h3>
      <p class="formula">Fórmula = Diámetro<sup>2</sup> × π × Largo ÷ 4 × Peso Específico</p>
      <p class="formula"> = ${diametro}<sup>2</sup> × π × ${largo} ÷ 4 × ${pesoEspecifico}</p>
      <p class="formula">Peso ≈ ${resultadoTotal.toFixed(2)} kg</p>
    `;
  }
}

// Función para mostrar un mensaje de error en un elemento
function mostrarError(elemento, mensaje) {
  const errorElement = document.getElementById(elemento);
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.style.color = "red";
  }
}

// Función para ocultar un mensaje de error
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
document.querySelector(".enviar").addEventListener("click", calcularPesoCable);
