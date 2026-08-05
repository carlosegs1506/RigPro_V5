// Función para el cálculo de capacidad de trabajo según su %
function calculoCapacidadGrua() {
  // Obtenemos los valores de los campos del formulario
  const pesoBrutoInput = document.getElementById("peso");
  const capacidadGruaInput = document.getElementById("capacidad");

  const pesoBruto = parseFloat(pesoBrutoInput.value);
  const capacidadGrua = parseFloat(capacidadGruaInput.value);

  // Obtenemos los elementos de error
  const pesoError = document.getElementById("pesoError");
  const capacidadError = document.getElementById("capacidadError");

  // Validamos los valores ingresados
  if (isNaN(pesoBruto)) {
    mostrarError(pesoError, "Por favor ingrese un valor numérico válido.");
    return;
  } else {
    ocultarError(pesoError);
  }

  if (isNaN(capacidadGrua)) {
    mostrarError(capacidadError, "Por favor ingrese un valor numérico válido.");
    return;
  } else {
    ocultarError(capacidadError);
  }

  // Realizamos el cálculo
  const resultadoCapacidad = (pesoBruto / capacidadGrua) * 100;

  // Mostramos el resultado en pantalla
  document.getElementById("capacidadGrua").textContent = resultadoCapacidad.toFixed(1) + "%";

  // Mostramos el proceso y fórmulas utilizadas
  mostrarProceso(pesoBruto, capacidadGrua, resultadoCapacidad);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(peso, capacidad, resultadoCapacidad) {
  const procesoDiv = document.getElementById("procesoTrabajo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas</h3>
    <p class="formula">Fórmula = Carga / Capacidad Grúa * 100% </p>
    <p class="formula"> = ${peso} / ${capacidad} * 100</p>
    <p class="formula">Capacidad ≈ ${resultadoCapacidad.toFixed(2)} %</p>
    `;
    
  }
}

// Función para mostrar error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// Eventos para validar los campos
document.getElementById("peso").addEventListener("input", validarPeso);
document.getElementById("capacidad").addEventListener("input", validarCapacidad);

function validarPeso() {
  const pesoBruto = parseFloat(document.getElementById("peso").value);
  const pesoError = document.getElementById("pesoError");

  if (isNaN(pesoBruto)) {
    mostrarError(pesoError, "Por favor ingrese un valor numérico válido.");
  } else {
    ocultarError(pesoError);
  }
}

function validarCapacidad() {
  const capacidadGrua = parseFloat(document.getElementById("capacidad").value);
  const capacidadError = document.getElementById("capacidadError");

  if (isNaN(capacidadGrua)) {
    mostrarError(capacidadError, "Por favor ingrese un valor numérico válido.");
  } else {
    ocultarError(capacidadError);
  }
}
