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

// Función para el cálculo de presión
function calculoPresion() {
  // Obtenemos los valores de los campos del formulario
  const fuerzaCilindro = parseFloat(document.getElementById("fuerza").value);
  const largo = parseFloat(document.getElementById("largo").value);
  const ancho = parseFloat(document.getElementById("ancho").value);
  const fuerzaError = document.getElementById("fuerzaError");
  const largoError = document.getElementById("largoError");
  const anchoError = document.getElementById("anchoError");

  // Validamos los valores ingresados
  if (!validarValor(fuerzaCilindro, fuerzaError, "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(largo, largoError, "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(ancho, anchoError, "Por favor, ingresa un valor numérico válido.")) return;

  // Presión = Fuerza / Área, donde Área = Largo x Ancho
  const area = largo * ancho;
  const presion = fuerzaCilindro / area;

  // Mostramos el resultado en pantalla
  document.getElementById("resultado").innerHTML = presion.toFixed(2) + " Ton/m²";

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(fuerzaCilindro, largo, ancho, presion);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(fuerzaCilindro, largo, ancho, presion) {
  const procesoDiv = document.getElementById("procesoPresion");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
        <h3>Proceso y Fórmula:</h3>
        <p class="formula">Presión = Fuerza ÷ Área</p>
        <p class="formula"> = ${fuerzaCilindro} ÷ (${largo} × ${ancho})</p>
        <p class="formula">Presión ≈ ${presion.toFixed(2)} Ton/m²</p>
    `;
  }

  // Mostrar el div de la imagen
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  imagenProcesoDiv.style.display = "block";
}

// Función para ocultar la imagen de proceso
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  imagenProcesoDiv.style.display = "none";
}
