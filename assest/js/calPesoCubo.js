// Función para el cálculo del peso de un cubo
function calcularPesoCubo() {
  // Obtenemos los valores de los campos del formulario
  const largo = parseFloat(document.getElementById("largo").value);
  const ancho = parseFloat(document.getElementById("ancho").value);
  const alto = parseFloat(document.getElementById("alto").value);
  const pesoEspecifico = parseFloat(document.getElementById("peso_especifico").value);

  const campos = [
    { valor: largo, errorId: 'largoError' },
    { valor: ancho, errorId: 'anchoError' },
    { valor: alto, errorId: 'altoError' },
    { valor: pesoEspecifico, errorId: 'peso_especificoError' }
  ];

  // Validar los valores ingresados
  let validacionExitosa = true;

  for (let campo of campos) {
    if (isNaN(campo.valor)) {
      mostrarError(campo.errorId, "Por favor, ingresa un valor numérico válido.");
      validacionExitosa = false;
      break;
    } else {
      ocultarError(campo.errorId);
    }
  }

  if (!validacionExitosa) return;

  // Convertir peso específico de toneladas métricas a kilogramos
  const pesoEspecificoKg = pesoEspecifico * 1000;

  // Realizar el cálculo
  const volumen = largo * ancho * alto;
  const pesoCuboKg = volumen * pesoEspecificoKg;
  const pesoCuboToneladas = pesoCuboKg / 1000;

  // Mostramos el resultado en pantalla
  document.getElementById("pesoCubo").textContent = `${pesoCuboKg.toFixed(2)} Kg / ${pesoCuboToneladas.toFixed(2)} Ton`;

  // Mostramos el proceso y fórmulas utilizadas
  mostrarProceso(largo, ancho, alto, pesoEspecifico, pesoCuboKg, pesoCuboToneladas);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(largo, ancho, alto, pesoEspecifico, pesoCuboKg, pesoCuboToneladas) {
  const procesoDiv = document.getElementById("procesoCubo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Fórmula y Proceso:</h3>
    <p class="formula">Fórmula = Largo * Ancho * Alto * Peso Específico</p>
    <p class="formula"> = ${largo} * ${ancho} * ${alto} * ${pesoEspecifico}</p>
    <p class="formula">Peso ≈ ${pesoCuboKg.toFixed(2)} Kg / ${pesoCuboToneladas.toFixed(2)} Ton</p>
    `;
  }

  // Mostrar el div de la imagen
  document.getElementById("imagenProceso").style.display = "block";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}

// Funciones para manejar errores
function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.style.color = "red";
  } else {
    console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
  }
  ocultarImagen();
}

function ocultarError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  } else {
    console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
  }
}

// Ejecutamos la función cuando se hace clic en el botón
document.querySelector(".calcular").addEventListener("click", calcularPesoCubo);
