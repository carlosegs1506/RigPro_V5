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

// Función para calcular la tensión en un tándem
function calcularTension() {
  // Obtener los valores ingresados
  const peso = parseFloat(document.getElementById("peso").value);
  const d1 = parseFloat(document.getElementById("d1").value);
  const d2 = parseFloat(document.getElementById("d2").value);
  const d3 = parseFloat(document.getElementById("d3").value);
  const angulo = parseFloat(document.getElementById("angulo").value);

  // Validar que se ingresaron valores válidos
  if (!validarValor(peso, document.getElementById("pesoError"), "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(d1, document.getElementById("d1Error"), "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(d2, document.getElementById("d2Error"), "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(d3, document.getElementById("d3Error"), "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(angulo, document.getElementById("anguloError"), "Por favor, ingresa un valor numérico válido.")) return;

  // Calcular la tangente del ángulo en grados
  const tangenteAngulo = Math.tan((angulo * Math.PI) / 180);

  // Calcular la Tensión 1 usando la fórmula correcta
  const tension1 = (peso * (d2 + d3 * tangenteAngulo)) / (d1 + d2);

  // Calcular la Tensión 2
  const tension2 = peso - tension1;

  // Mostrar el resultado en pantalla
  document.getElementById("resultado").innerHTML = `Tensión 1: ${tension1.toFixed(2)} Ton <br>Tensión 2: ${tension2.toFixed(2)} Ton`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(peso, d1, d2, d3, angulo, tension1, tension2, tangenteAngulo);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(peso, d1, d2, d3, angulo, tension1, tension2, tangenteAngulo) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  const lang = document.documentElement.lang;

  if (lang === "es") {
    procesoDiv.innerHTML = `
      <h3>Fórmula y Desarrollo:</h3>
      <p class="formula">Tensión 1 = Peso * (d2 + d3 * Tang°) / (d1 + d2)</p>
      <p class="formula">  = ${peso} * (${d2} + ${d3} * ${tangenteAngulo.toFixed(3)}) / (${d1} + ${d2}) <br> = ${tension1.toFixed(2)} Ton</p>
      <p class="formula">Tensión 2 = Peso - Tensión 1</p>
      <p class="formula"> = ${peso} - ${tension1.toFixed(2)} <br> = ${tension2.toFixed(2)} Ton</p>
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
