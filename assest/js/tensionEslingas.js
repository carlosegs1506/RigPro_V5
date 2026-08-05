// Función para mostrar un error en un elemento
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar el error en un elemento
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// Función para validar un valor numérico
function validarValor(valor, elementoError, mensajeError) {
  if (isNaN(valor)) {
    mostrarError(elementoError, mensajeError);
    return false;
  }
  ocultarError(elementoError);
  return true;
}

// Función para el cálculo del ángulo de trabajo o maniobra
function calcularAngulo() {
  // Obtenemos los valores de los campos del formulario
  const radio = parseFloat(document.getElementById("radio").value);
  const largo = parseFloat(document.getElementById("largo").value);

  // Validar los valores ingresados
  if (!validarValor(radio, document.getElementById("radioError"), "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(largo, document.getElementById("largoError"), "Por favor, ingresa un valor numérico válido.")) return;

  // Validación adicional de radio < largo
  if (radio >= largo) {
    mostrarError(document.getElementById("radioError"), "El radio debe ser menor que el largo.");
    return;
  }

  // Si no hay errores, ocultar los mensajes de error
  ocultarError(document.getElementById("radioError"));
  ocultarError(document.getElementById("largoError"));

  // Realizar el cálculo
  const angulo = (Math.acos(radio / largo) * 180) / Math.PI;

  // Mostrar el resultado en pantalla
  document.getElementById("resultado").textContent = angulo.toFixed(2) + " °";
}

// Función para el cálculo de la tensión de eslingas
function calcularTensionEslingas() {
  // Obtenemos los valores de los campos del formulario
  const pesoElemento = parseFloat(document.getElementById("peso").value);
  const numEslingas = parseFloat(document.getElementById("numero").value);
  const anguloGrados = parseFloat(document.getElementById("angulo").value);

  // Validar los valores ingresados
  if (!validarValor(pesoElemento, document.getElementById("pesoError"), "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(numEslingas, document.getElementById("numeroError"), "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(anguloGrados, document.getElementById("anguloError"), "Por favor, ingresa un valor numérico válido.")) return;

  // Si no hay errores, ocultar los mensajes de error
  ocultarError(document.getElementById("pesoError"));
  ocultarError(document.getElementById("numeroError"));
  ocultarError(document.getElementById("anguloError"));

  // Calcular las variables necesarias
  const anguloRadianes = anguloGrados * (Math.PI / 180);
  const tensionEslingas = pesoElemento / (numEslingas * Math.sin(anguloRadianes));

  // Mostrar el resultado en pantalla
  document.getElementById("tensionEslingas").textContent = tensionEslingas.toFixed(2) + " kg";

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(pesoElemento, numEslingas, anguloGrados, tensionEslingas);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(pesoElemento, numEslingas, anguloGrados, tensionEslingas) {
  const procesoDiv = document.getElementById("proceso");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
      procesoDiv.innerHTML = `
          <h3>Fórmula y Desarrollo:</h3>
          <p class="formula">Fórmula: Tensión = Peso / (Número de Eslingas * Seno(Ángulo))</p>
          <p class="formula"> = ${pesoElemento} / (${numEslingas} * Seno(${anguloGrados}°))</p>
          <p class="formula"> ≈ ${tensionEslingas.toFixed(2)} kg</p>
      `;
  }

  // Mostrar el div de la imagen
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  if (imagenProcesoDiv) {
      imagenProcesoDiv.style.display = "block";
  }
}
