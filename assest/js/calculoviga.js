// El Largo y el Ancho del alma (plancha C) dependen de las alas, así que se completan solos
// para que el usuario no tenga que restar el espesor de las alas manualmente.
document.addEventListener("DOMContentLoaded", () => {
  const largoAb = document.getElementById("largo_ab");
  const altoViga = document.getElementById("alto_viga");
  const espesorAb = document.getElementById("espesor_ab");
  const largoC = document.getElementById("largo_c");
  const anchoC = document.getElementById("ancho_c");

  function actualizarLargoC() {
    largoC.value = largoAb.value;
  }

  function actualizarAnchoC() {
    const alto = parseFloat(altoViga.value.replace(",", "."));
    const espesor = parseFloat(espesorAb.value.replace(",", "."));
    if (!isNaN(alto) && !isNaN(espesor)) {
      anchoC.value = (alto - espesor * 2).toFixed(2);
    } else {
      anchoC.value = "";
    }
  }

  largoAb.addEventListener("input", actualizarLargoC);
  altoViga.addEventListener("input", actualizarAnchoC);
  espesorAb.addEventListener("input", actualizarAnchoC);
});

// Función para calcular el volumen de la viga
function calcularVolumenViga() {
  // Obtenemos los valores de los campos del formulario
  const largoViga = parseFloat(document.getElementById("largo_ab").value.replace(",", "."));
  const anchoViga = parseFloat(document.getElementById("ancho_ab").value.replace(",", "."));
  const espesorViga = parseFloat(document.getElementById("espesor_ab").value.replace(",", "."));
  const largoVigaCentral = parseFloat(document.getElementById("largo_c").value.replace(",", "."));
  const anchoVigaCentral = parseFloat(document.getElementById("ancho_c").value.replace(",", "."));
  const espesorVigaCentral = parseFloat(document.getElementById("espesor_c").value.replace(",", "."));
  const pesoEspecifico = parseFloat(document.getElementById("peso_especifico").value.replace(",", "."));

  const campos = [
    { valor: largoViga, errorId: 'largo_abError' },
    { valor: anchoViga, errorId: 'ancho_abError' },
    { valor: espesorViga, errorId: 'espesor_abError' },
    { valor: largoVigaCentral, errorId: 'largo_cError' },
    { valor: anchoVigaCentral, errorId: 'ancho_cError' },
    { valor: espesorVigaCentral, errorId: 'espesor_cError' },
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

  // Peso (kg) = Ancho (mm) x Largo (m) x Espesor (mm) x Peso Específico (Ton/m³) / 1000
  const pesoAlas = (anchoViga * largoViga * espesorViga * pesoEspecifico * 2) / 1000; // Peso de las dos alas (A y B)
  const pesoAlma = (anchoVigaCentral * largoVigaCentral * espesorVigaCentral * pesoEspecifico) / 1000; // Peso del alma (C)
  const pesoKilogramos = pesoAlas + pesoAlma;
  const pesoToneladas = pesoKilogramos / 1000;

  // Mostramos el resultado en pantalla
  document.getElementById("vigaH").textContent = `${pesoKilogramos.toFixed(2)} kg | ${pesoToneladas.toFixed(3)} Ton`;

  // Mostramos el proceso y fórmulas utilizadas
  mostrarProcesoViga(largoViga, anchoViga, espesorViga, pesoEspecifico, largoVigaCentral, anchoVigaCentral, espesorVigaCentral, pesoAlas, pesoAlma, pesoKilogramos, pesoToneladas);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProcesoViga(largoViga, anchoViga, espesorViga, pesoEspecifico, largoVigaCentral, anchoVigaCentral, espesorVigaCentral, pesoAlas, pesoAlma, pesoKilogramos, pesoToneladas) {
  const procesoDiv = document.getElementById("procesoViga");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p>1. Calculamos el peso de las dos alas (A y B):</p>
    <p class="formula">Peso Alas = Ancho (mm) × Largo (m) × Espesor (mm) × Peso Específico ÷ 1000 × 2</p>
    <p class="formula">= ${anchoViga} × ${largoViga} × ${espesorViga} × ${pesoEspecifico} ÷ 1000 × 2</p>
    <p class="formula">= ${pesoAlas.toFixed(2)} kg</p>
    <p>2. Calculamos el peso del alma (C):</p>
    <p class="formula">Peso Alma = Ancho (mm) × Largo (m) × Espesor (mm) × Peso Específico ÷ 1000</p>
    <p class="formula">= ${anchoVigaCentral} × ${largoVigaCentral} × ${espesorVigaCentral} × ${pesoEspecifico} ÷ 1000</p>
    <p class="formula">= ${pesoAlma.toFixed(2)} kg</p>
    <p>3. Calculamos el peso total de la viga:</p>
    <p class="formula">Peso Viga = Peso Alas + Peso Alma</p>
    <p class="formula">= ${pesoAlas.toFixed(2)} kg + ${pesoAlma.toFixed(2)} kg</p>
    <p class="formula">= ${pesoKilogramos.toFixed(2)} kg (${pesoToneladas.toFixed(3)} Ton)</p>
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

function ocultarError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = "";
  } else {
    console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
  }
}

function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}

