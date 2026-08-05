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

// Función para calcular el ángulo
function calcularAngulo() {
  const radio = parseFloat(document.getElementById("radio").value);
  const largo = parseFloat(document.getElementById("largo").value);
  const radioError = document.getElementById("radioError");
  const largoError = document.getElementById("largoError");

  // Validar los valores ingresados
  if (!validarValor(radio, radioError, "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(largo, largoError, "Por favor, ingresa un valor numérico válido.")) return;

  // Calcular el ángulo
  const angulo = (Math.acos(radio / largo) * 180) / Math.PI;

  // Mostrar el resultado
  document.getElementById("resultado").textContent = angulo.toFixed(2) + " °";
}

// Función para calcular la tensión de eslingas
function calcularTensionEslngas() {
  const pesoElemento = parseFloat(document.getElementById("peso").value);
  const numEslingas = parseFloat(document.getElementById("numero").value);
  const anguloGrados = parseFloat(document.getElementById("angulo").value);
  const pesoError = document.getElementById("pesoError");
  const numeroError = document.getElementById("numeroError");
  const anguloError = document.getElementById("anguloError");

  // Validar los valores ingresados
  if (!validarValor(pesoElemento, pesoError, "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(numEslingas, numeroError, "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(anguloGrados, anguloError, "Por favor, ingresa un valor numérico válido.")) return;

  // Calcular la tensión de eslingas
  const anguloRadianes = anguloGrados * (Math.PI / 180);
  const tensionEslingas = pesoElemento / (numEslingas * Math.sin(anguloRadianes));

  // Mostrar el resultado
  document.getElementById("tensionEslingas").innerHTML = tensionEslingas.toFixed(2) + " kg";
}

// Función para calcular el porcentaje de utilización de eslingas
function calculoUtilizacionEslingas() {
  const tensionEslinga = parseFloat(document.getElementById("tension").value);
  const capacidadEslinga = parseFloat(document.getElementById("capacidad").value);
  const tensionError = document.getElementById("tensionError");
  const capacidadError = document.getElementById("capacidadError");

  // Validar los valores ingresados
  if (!validarValor(tensionEslinga, tensionError, "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(capacidadEslinga, capacidadError, "Por favor, ingresa un valor numérico válido.")) return;

  // Calcular el porcentaje de utilización
  const calculoPorcentajeUtilizacion = (tensionEslinga / capacidadEslinga) * 100;

  // Mostrar el resultado
  document.getElementById("utilizacionEslingas").innerHTML = calculoPorcentajeUtilizacion.toFixed(2) + "%";

  // Mostrar el proceso y las fórmulas utilizadas
  mostrarProceso(tensionEslinga, capacidadEslinga, calculoPorcentajeUtilizacion);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(tensionEslinga, capacidadEslinga, calculoPorcentajeUtilizacion) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Fórmula y Desarrollo:</h3>
    <p class="formula">Fórmula = Tensión / Capacidad * 100</p>
    <p class="formula"> = ${tensionEslinga} / ${capacidadEslinga} * 100</p>
    <p class="formula">% Utilización ≈ ${calculoPorcentajeUtilizacion.toFixed(2)}%</p>
    `;
  }
}


