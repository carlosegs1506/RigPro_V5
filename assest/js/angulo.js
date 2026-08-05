// Función para calcular el ángulo de trabajo
function calcularAngulo() {
  console.log("Función calcularAngulo llamada");

  // Obtener los valores de los campos del formulario
  const radioInput = document.getElementById("radio");
  const largoInput = document.getElementById("largo");

  const radio = parseFloat(radioInput.value);
  const largo = parseFloat(largoInput.value);

  console.log("Valor de radio:", radio);
  console.log("Valor de largo:", largo);

  // Validar los valores ingresados
  const campos = [
    { valor: radio, errorId: 'radioError', elemento: radioInput },
    { valor: largo, errorId: 'largoError', elemento: largoInput }
  ];

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

  // Validación adicional de radio < largo
  if (radio >= largo) {
    mostrarError("radioError", "El radio debe ser menor que el largo.");
    return;
  }

  // Si no hay errores, ocultar los mensajes de error
  ocultarError("radioError");
  ocultarError("largoError");

  // Realizar el cálculo
  const anguloRadianes = Math.acos(radio / largo);
  const anguloGrados = (anguloRadianes * 180) / Math.PI;

  // Mostrar el resultado en pantalla
  document.getElementById("resultado").textContent = anguloGrados.toFixed(2) + " °";

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(radio, largo, anguloGrados, anguloRadianes);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(radio, largo, anguloGrados) {
  const procesoDiv = document.getElementById("proceso");
  // angulo.js se reutiliza en paginas que no muestran el desglose de formula
  // para este mini-calculador (usan su propio div de proceso, ej.
  // "procesoManiobra" o "procesoAhorcado"). Si no existe, simplemente no
  // se muestra el desglose en vez de romper el script con un TypeError.
  if (!procesoDiv) return;
  console.log("Función mostrarProceso llamada");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Fórmula y Proceso:</h3>
      <p class="formula">Fórmula = cos<sup>-1</sup>(Radio / Largo)</p>
      <p class="formula"> = cos<sup>-1</sup>(${radio} / ${largo})</p>
      <p class="formula">Ángulo ≈ ${anguloGrados.toFixed(2)} °</p>
    `;
  }

  // Mostrar el div de la imagen
  document.getElementById("imagenProceso").style.display = "block";
}

// Función para mostrar mensajes de error
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

// Función para ocultar mensajes de error
function ocultarError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  } else {
    console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
  }
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}

// Ejecutamos la función cuando se hace clic en el botón
document.querySelector(".enviar").addEventListener("click", calcularAngulo);
