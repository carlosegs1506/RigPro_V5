//Calculo peso de una esfera
document.addEventListener("DOMContentLoaded", function() {
  const campos = [
    { id: "diametro", errorId: "diametroError" },
    { id: "peso", errorId: "pesoError" }
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

// Función para calcular el peso de una esfera
function calculoEsfera() {
  const campos = [
    { id: "diametro", errorId: "diametroError" },
    { id: "peso", errorId: "pesoError" }
  ];

  // Validar los valores ingresados y mostrar el primer error encontrado
  for (let campo of campos) {
    const valor = parseFloat(document.getElementById(campo.id).value);
    if (isNaN(valor)) {
      mostrarError(document.getElementById(campo.errorId), "Por favor, ingresa un valor numérico válido");
      return;
    } else {
      ocultarError(campo.errorId);
    }
  }

  // Obtener los valores después de la validación
  const dEsfera = parseFloat(document.getElementById("diametro").value);
  const pesoEsfera = parseFloat(document.getElementById("peso").value);

  // Volumen de la esfera: V = π·D³ / 6
  const volumenEsfera = (Math.PI * dEsfera ** 3) / 6;

  // Calcular el peso de la esfera en toneladas y kilogramos
  const pesoToneladas = volumenEsfera * pesoEsfera;
  const pesoKilogramos = pesoToneladas * 1000;

  // Mostrar el resultado en pantalla
  document.getElementById("esfera").innerHTML = `${pesoKilogramos.toFixed(2)} Kg`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(dEsfera, pesoEsfera, volumenEsfera, pesoToneladas, pesoKilogramos);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(dEsfera, pesoEsfera, volumenEsfera, pesoToneladas, pesoKilogramos) {
  const procesoDiv = document.getElementById("procesoEsfera");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmula:</h3>
    <p>1. Calculamos el volumen de la esfera:</p>
    <p class="formula">Volumen = π × Diámetro³ / 6</p>
    <p class="formula">= ${Math.PI.toFixed(2)} × ${dEsfera}³ / 6</p>
    <p class="formula">= ${volumenEsfera.toFixed(4)} m³</p>
    <p>2. Calculamos el peso en toneladas:</p>
    <p class="formula">Peso (Toneladas) = Volumen × Peso Específico</p>
    <p class="formula">= ${volumenEsfera.toFixed(4)} m³ × ${pesoEsfera} T/m³</p>
    <p class="formula">= ${pesoToneladas.toFixed(2)} Ton</p>
    <p>3. Convertimos el peso a kilogramos:</p>
    <p class="formula">Peso (Kilogramos) = Peso (Toneladas) × 1000</p>
    <p class="formula">= ${pesoKilogramos.toFixed(2)} kg</p>
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
