// Función para calcular el peso de una barra de construcción
function calculoBarraFierro() {
  // Obtenemos los valores de los campos del formulario
  const diametroBarraInput = document.getElementById("diametro");
  const largoBarraInput = document.getElementById("largo");

  const diametroBarra = parseFloat(diametroBarraInput.value);
  const largoBarra = parseFloat(largoBarraInput.value);

  // Validar los valores ingresados
  const campos = [
    { valor: diametroBarra, errorId: 'diametroError', elemento: diametroBarraInput },
    { valor: largoBarra, errorId: 'largoError', elemento: largoBarraInput }
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

  // Si no hay errores, ocultar los mensajes de error
  ocultarError("diametroError");
  ocultarError("largoError");

  // Peso (kg) = Diámetro² (mm) × 0.00617 × Largo (m)
  // 0.00617 = (π/4 × densidad del acero 7850 kg/m³) / 1.000.000 (mm² → m²)
  const resultadoFinal = Math.pow(diametroBarra, 2) * 0.00617 * largoBarra;

  // Mostramos el resultado en pantalla
  document.getElementById("barraFierro").textContent = resultadoFinal.toFixed(2) + " Kg";

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(diametroBarra, largoBarra, resultadoFinal);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametroBarra, largoBarra, resultadoFinal) {
  const procesoDiv = document.getElementById("procesoBarra");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Fórmula y Proceso:</h3>
    <p class="formula">Peso (Kg) = Diámetro (mm)<sup>2</sup> × 0.00617 × Largo (m)</p>
    <p class="formula">= ${diametroBarra}<sup>2</sup> × 0.00617 × ${largoBarra}</p>
    <p class="formula">Peso ≈ ${resultadoFinal.toFixed(2)} Kg</p>
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

// Función para ocultar la imagen de proceso
function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}
