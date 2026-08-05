// Función para calcular el peso de un cubo de hormigón vacío
document.addEventListener("DOMContentLoaded", function() {
  const campos = [
    { id: "largo1", errorId: "largo1Error" },
    { id: "largo2", errorId: "largo2Error" },
    { id: "ancho1", errorId: "ancho1Error" },
    { id: "ancho2", errorId: "ancho2Error" },
    { id: "alto", errorId: "altoError" },
    { id: "altoInterior", errorId: "altoInteriorError" },
    { id: "peso", errorId: "pesoError" }
  ];

  campos.forEach(campo => {
    document.getElementById(campo.id).addEventListener("input", function() {
      if (!isNaN(parseFloat(this.value))) {
        ocultarError(campo.errorId);
      }
    });
  });

  document.getElementById("tipoHueco").addEventListener("change", actualizarTipoHueco);
  actualizarTipoHueco();
});

// Muestra/oculta el campo de Alto Interior según el tipo de hueco elegido
function actualizarTipoHueco() {
  const tipoHueco = document.getElementById("tipoHueco").value;
  const campoAltoInterior = document.getElementById("campoAltoInterior");

  if (tipoHueco === "fondo") {
    campoAltoInterior.style.display = "";
  } else {
    campoAltoInterior.style.display = "none";
    ocultarError("altoInteriorError");
  }
}

// Función para calcular el peso de un cubo de hormigón vacío
function calculoCubo() {
  const tipoHueco = document.getElementById("tipoHueco").value;

  const campos = [
    { id: "largo1", errorId: "largo1Error" },
    { id: "largo2", errorId: "largo2Error" },
    { id: "ancho1", errorId: "ancho1Error" },
    { id: "ancho2", errorId: "ancho2Error" },
    { id: "alto", errorId: "altoError" },
    { id: "peso", errorId: "pesoError" }
  ];

  if (tipoHueco === "fondo") {
    campos.push({ id: "altoInterior", errorId: "altoInteriorError" });
  }

  const valores = campos.map(campo => parseFloat(document.getElementById(campo.id).value));

  // Ocultar todos los mensajes de error antes de la validación
  campos.forEach(campo => ocultarError(campo.errorId));

  // Validar los valores ingresados y mostrar el primer error encontrado
  for (let i = 0; i < valores.length; i++) {
    if (isNaN(valores[i])) {
      mostrarError(campos[i].errorId, "Por favor, ingresa un valor numérico válido");
      return;
    }
  }

  const [largoExterior, largoInterior, anchoExterior, anchoInterior, altoExterior, pesoMaterial] = valores;
  const altoInterior = tipoHueco === "fondo" ? valores[6] : altoExterior;

  if (tipoHueco === "fondo" && altoInterior >= altoExterior) {
    mostrarError("altoInteriorError", "Debe ser menor que el Alto Exterior");
    return;
  }

  // Calculamos las variables necesarias
  const volumenExterior = largoExterior * anchoExterior * altoExterior;
  const volumenInterior = largoInterior * anchoInterior * altoInterior;
  const resultadoVolumen = volumenExterior - volumenInterior;
  const pesoTotalCuboToneladas = resultadoVolumen * pesoMaterial;
  const pesoTotalCuboKg = pesoTotalCuboToneladas * 1000;

  // Mostramos en pantalla el resultado
  document.getElementById("cubo").innerHTML = `${pesoTotalCuboKg.toFixed(1)} Kg / ${pesoTotalCuboToneladas.toFixed(2)} Ton`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(
    largoExterior,
    largoInterior,
    anchoExterior,
    anchoInterior,
    altoExterior,
    altoInterior,
    pesoMaterial,
    volumenExterior,
    volumenInterior,
    resultadoVolumen,
    pesoTotalCuboKg,
    pesoTotalCuboToneladas
  );
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(largoExterior,
  largoInterior,
  anchoExterior,
  anchoInterior,
  altoExterior,
  altoInterior,
  pesoMaterial,
  volumenExterior,
  volumenInterior,
  resultadoVolumen,
  pesoTotalCuboKg,
  pesoTotalCuboToneladas) {
  const procesoDiv = document.getElementById("procesoCubo");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p class="formula">Volumen Exterior = Largo Exterior * Ancho Exterior * Alto Exterior</p>
    <p class="formula">= ${largoExterior} * ${anchoExterior} * ${altoExterior} = ${volumenExterior.toFixed(2)} m³</p>
    <p class="formula">Volumen Interior = Largo Interior * Ancho Interior * Alto Interior</p>
    <p class="formula">= ${largoInterior} * ${anchoInterior} * ${altoInterior} = ${volumenInterior.toFixed(2)} m³</p>
    <p class="formula">Volumen = Volumen Exterior - Volumen Interior</p>
    <p class="formula">= ${volumenExterior.toFixed(2)} - ${volumenInterior.toFixed(2)} = ${resultadoVolumen.toFixed(2)} m³</p>
    <p class="formula">Peso = Volumen * Peso Específico</p>
    <p class="formula">= ${resultadoVolumen.toFixed(2)} * ${pesoMaterial} = ${pesoTotalCuboToneladas.toFixed(2)} Ton / ${pesoTotalCuboKg.toFixed(1)} Kg</p>
    `;
  } else if (lang === "en") {
    // Texto en inglés
    procesoDiv.innerHTML = `
    <h3>Process and Formulas:</h3>
    <p class="formula">Exterior Volume = Exterior Length * Exterior Width * Exterior Height</p>
    <p class="formula">= ${largoExterior} * ${anchoExterior} * ${altoExterior} = ${volumenExterior.toFixed(2)} m³</p>
    <p class="formula">Interior Volume = Interior Length * Interior Width * Interior Height</p>
    <p class="formula">= ${largoInterior} * ${anchoInterior} * ${altoInterior} = ${volumenInterior.toFixed(2)} m³</p>
    <p class="formula">Volume = Exterior Volume - Interior Volume</p>
    <p class="formula">= ${volumenExterior.toFixed(2)} - ${volumenInterior.toFixed(2)} = ${resultadoVolumen.toFixed(2)} m³</p>
    <p class="formula">Weight = Volume * Specific Weight</p>
    <p class="formula">= ${resultadoVolumen.toFixed(2)} * ${pesoMaterial} = ${pesoTotalCuboToneladas.toFixed(2)} Ton / ${pesoTotalCuboKg.toFixed(1)} Kg</p>
    `;
  }

  // Mostrar el div de la imagen
  document.getElementById("imagenProceso").style.display = "block";
}

// Función para mostrar mensajes de error
function mostrarError(elementoId, mensaje) {
  ocultarImagen();

  // Ocultar todos los mensajes de error
  ["largo1Error", "largo2Error", "ancho1Error", "ancho2Error", "altoError", "altoInteriorError", "pesoError"].forEach(ocultarError);

  // Mostrar el error correspondiente
  const errorElemento = document.getElementById(elementoId);
  errorElemento.textContent = mensaje;
  errorElemento.style.color = "red";
}

// Función para ocultar mensajes de error
function ocultarError(elementoId) {
  const errorElemento = document.getElementById(elementoId);
  errorElemento.textContent = "";
  errorElemento.style.color = "initial";
}

// Función para ocultar la imagen de proceso
function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}
