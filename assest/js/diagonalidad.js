// Función para calcular diagonalidad
document.addEventListener("DOMContentLoaded", function() {
  const campos = [
    { id: "radio", errorId: "radioError" },
    { id: "altura", errorId: "alturaError" }
  ];

  // Añadir event listeners para ocultar errores al ingresar un valor válido
  campos.forEach(campo => {
    document.getElementById(campo.id).addEventListener("input", function() {
      if (!isNaN(parseFloat(this.value))) {
        ocultarError(campo.errorId);
      }
    });
  });
});

// Función para calcular diagonalidad
function calculoDiagonalidad() {
  const campos = [
    { id: "radio", errorId: "radioError" },
    { id: "altura", errorId: "alturaError" }
  ];

  // Validar los valores ingresados y mostrar el primer error encontrado
  for (let campo of campos) {
    const valor = parseFloat(document.getElementById(campo.id).value);
    if (isNaN(valor)) {
      mostrarError(document.getElementById(campo.errorId), "Por favor, ingresa un valor numérico válido.");
      return;
    } else {
      ocultarError(campo.errorId);
    }
  }

  // Obtener los valores después de la validación
  const radio = parseFloat(document.getElementById("radio").value);
  const altura = parseFloat(document.getElementById("altura").value);

  // Calcular las variables necesarias
  const resultadoDiagonalidad = Math.sqrt(Math.pow(radio, 2) + Math.pow(altura, 2));

  // Mostrar el resultado en pantalla
  document.getElementById("diagonalidad").innerHTML = `${resultadoDiagonalidad.toFixed(1)} mts`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(radio, altura, resultadoDiagonalidad);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(radio, altura, resultadoDiagonalidad) {
  const procesoDiv = document.getElementById("procesoDiagonalidad");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmula:</h3>
    <p class="formula">Fórmula = √(Radio<sup>2</sup> + Altura<sup>2</sup>)</p>
    <p class="formula">= √(${radio}<sup>2</sup> + ${altura}<sup>2</sup>)</p>
    <p class="formula">Diagonalidad ≈ ${resultadoDiagonalidad.toFixed(2)} mts</p>
    `;
  }

  // Mostrar el div de la imagen
  document.getElementById("imagenProceso").style.display = "block";
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  ocultarImagen();
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
  document.getElementById("imagenProceso").style.display = "none";
}
