//Funcion para el calculo de angulo
document.addEventListener("DOMContentLoaded", function() {
  const campoAngulo = { id: "angulo", errorId: "anguloError" };

  // Añadir event listener para ocultar el error al ingresar un valor válido
  document.getElementById(campoAngulo.id).addEventListener("input", function() {
    if (!isNaN(parseFloat(this.value))) {
      ocultarError(campoAngulo.errorId);
    }
  });
});

// Función para calcular el factor ángulo
function calcularFactorAngulo() {
  const campoAngulo = { id: "angulo", errorId: "anguloError" };
  const anguloGrados = parseFloat(document.getElementById(campoAngulo.id).value);

  // Validar los valores ingresados y mostrar el primer error encontrado
  if (isNaN(anguloGrados)) {
    mostrarError(document.getElementById(campoAngulo.errorId), "Por favor, ingrese un valor numérico válido.");
    return;
  }

  // Si no hay errores, ocultar los mensajes de error
  ocultarError(campoAngulo.errorId);

  // Convertir el ángulo de grados a radianes
  const anguloRadianes = (Math.PI / 180) * anguloGrados;

  // Calcular el seno del ángulo
  const senoAngulo = Math.sin(anguloRadianes);

  // Verificar si el seno es igual a 0 (para evitar divisiones por cero)
  if (Math.abs(senoAngulo) < Number.EPSILON) {
    mostrarError(document.getElementById(campoAngulo.errorId), "El ángulo no es válido. El seno del ángulo es cero.");
    return;
  }

  // Calcular el factor ángulo utilizando la fórmula: 1 / seno del ángulo
  const factorAngulo = 1 / senoAngulo;

  // Mostrar el resultado en la página
  document.getElementById("resultado").innerText = ` ${factorAngulo.toFixed(3)}`;

  // Mostrar el proceso y fórmula utilizada
  mostrarProceso(anguloGrados, anguloRadianes, senoAngulo, factorAngulo);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(anguloGrados, anguloRadianes, senoAngulo, factorAngulo) {
  const procesoDiv = document.getElementById("procesoFactorAngulo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmula:</h3>
    <p>1. Obtenemos el valor del ángulo en grados: ${anguloGrados}°.</p>
    <p>2. Convertimos el ángulo a radianes: ${anguloRadianes.toFixed(3)} rad.</p>
    <p>3. Calculamos el seno del ángulo: ${senoAngulo.toFixed(3)}.</p>
    <p>4. Realizamos el cálculo:</p>
    <p class="formula">Fórmula = 1 / seno del ángulo</p>
    <p class="formula">= 1 / ${senoAngulo.toFixed(3)}</p>
    <p class="formula">Factor Ángulo ≈ ${factorAngulo.toFixed(3)}</p>
    `;
  }
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  ocultarImagen(); // Asegurarse de ocultar la imagen de proceso si aparece
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar mensajes de error
function ocultarError(elementoId) {
  const errorElemento = document.getElementById(elementoId);
  if (errorElemento) {
    errorElemento.textContent = "";
    errorElemento.style.color = "initial";
  }
}

// Función para ocultar la imagen de proceso
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  if (imagenProcesoDiv) {
    imagenProcesoDiv.style.display = "none";
  }
}
