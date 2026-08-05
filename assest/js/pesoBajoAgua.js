// Función para calcular el peso de un dado/bloque sumergido en agua
// Fórmula (Manual Básico del Rigger, pág. 32): Principio de Arquímedes
// Peso Sumergido = Peso Real - (Volumen x Peso Específico del Agua)
function calcularPesoBajoAgua() {
  const largoInput = document.getElementById("largo");
  const anchoInput = document.getElementById("ancho");
  const altoInput = document.getElementById("alto");
  const pesoEspecificoInput = document.getElementById("pesoEspecifico");
  const pesoEspecificoAguaInput = document.getElementById("pesoEspecificoAgua");

  const largo = parseFloat(largoInput.value);
  const ancho = parseFloat(anchoInput.value);
  const alto = parseFloat(altoInput.value);
  const pesoEspecifico = parseFloat(pesoEspecificoInput.value);
  const pesoEspecificoAgua = parseFloat(pesoEspecificoAguaInput.value);

  const campos = [
    { valor: largo, errorId: "largoError" },
    { valor: ancho, errorId: "anchoError" },
    { valor: alto, errorId: "altoError" },
    { valor: pesoEspecifico, errorId: "pesoEspecificoError" },
    { valor: pesoEspecificoAgua, errorId: "pesoEspecificoAguaError" }
  ];

  let validacionExitosa = true;
  for (const campo of campos) {
    if (isNaN(campo.valor) || campo.valor <= 0) {
      mostrarError(campo.errorId, "Por favor, ingresa un valor numérico válido mayor a 0.");
      validacionExitosa = false;
      break;
    } else {
      ocultarError(campo.errorId);
    }
  }

  if (!validacionExitosa) return;

  // 1. Volumen del dado
  const volumen = largo * ancho * alto;

  // 2. Peso real (en el aire) del dado
  const pesoReal = volumen * pesoEspecifico;

  // 3. Empuje (peso del agua desplazada) y peso sumergido
  const empuje = volumen * pesoEspecificoAgua;
  const pesoSumergido = pesoReal - empuje;

  if (pesoSumergido < 0) {
    mostrarError(
      "pesoEspecificoError",
      "El peso específico del material es menor que el del agua: la pieza flotaría, no se hunde."
    );
    return;
  }

  document.getElementById("volumenResultado").innerText = `${volumen.toFixed(3)} m³`;
  document.getElementById("pesoRealResultado").innerText = `${pesoReal.toFixed(2)} Ton`;
  document.getElementById("pesoSumergidoResultado").innerText = `${pesoSumergido.toFixed(2)} Ton`;

  mostrarProceso(largo, ancho, alto, pesoEspecifico, pesoEspecificoAgua, volumen, pesoReal, empuje, pesoSumergido);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(largo, ancho, alto, pesoEspecifico, pesoEspecificoAgua, volumen, pesoReal, empuje, pesoSumergido) {
  const procesoDiv = document.getElementById("procesoBajoAgua");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmulas:</h3>
      <p>1. Calculamos el volumen del dado:</p>
      <p class="formula">Volumen = Largo × Ancho × Alto</p>
      <p class="formula">= ${largo} × ${ancho} × ${alto} = ${volumen.toFixed(3)} m³</p>
      <p>2. Calculamos el peso real del dado (fuera del agua):</p>
      <p class="formula">Peso Real = Volumen × Peso Específico del Material</p>
      <p class="formula">= ${volumen.toFixed(3)} × ${pesoEspecifico} = ${pesoReal.toFixed(2)} Ton</p>
      <p>3. Calculamos el empuje (peso del agua desplazada) y el peso sumergido:</p>
      <p class="formula">Empuje = Volumen × Peso Específico del Agua = ${volumen.toFixed(3)} × ${pesoEspecificoAgua} = ${empuje.toFixed(2)} Ton</p>
      <p class="formula">Peso Sumergido = Peso Real − Empuje = ${pesoReal.toFixed(2)} − ${empuje.toFixed(2)}</p>
      <p class="formula">Peso Sumergido ≈ ${pesoSumergido.toFixed(2)} Ton</p>
      <p style="color:#b45309;"><strong>Atención:</strong> este es el Principio de Arquímedes — útil para
      estimar la tensión real de una eslinga al izar una pieza sumergida (ej: rescate de equipos, dados de
      anclaje submarinos). No reemplaza mediciones de terreno.</p>
    `;
  }

  document.getElementById("imagenProceso").style.display = "block";
}

// Función para mostrar mensajes de error
function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.style.color = "red";
  }
}

// Función para ocultar mensajes de error
function ocultarError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  }
}

// Función para ocultar la imagen de proceso
function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}
