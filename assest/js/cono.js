// Función para el cálculo del peso de un cono truncado
document.addEventListener("DOMContentLoaded", function() {
  const inputs = [
    { id: "alto", errorId: "altoError" },
    { id: "diametro_superior", errorId: "diametro_superiorError" },
    { id: "diametro_inferior", errorId: "diametro_inferiorError" },
    { id: "peso_material", errorId: "peso_materialError" }
  ];

  inputs.forEach(input => {
    document.getElementById(input.id).addEventListener("input", function() {
      if (!isNaN(parseFloat(this.value))) {
        ocultarError(input.errorId);
      }
    });
  });
});

// Función para el cálculo del peso de un cono truncado
function calculoCono() {
  const campos = [
    { id: "alto", errorId: "altoError" },
    { id: "diametro_superior", errorId: "diametro_superiorError" },
    { id: "diametro_inferior", errorId: "diametro_inferiorError" },
    { id: "peso_material", errorId: "peso_materialError" }
  ];

  const valores = campos.map(campo => parseFloat(document.getElementById(campo.id).value));
  const [altoCono, dSuperior, dInferior, pesoEspecificoCono] = valores;

  // Ocultar todos los mensajes de error antes de la validación
  campos.forEach(campo => ocultarError(campo.errorId));

  // Validar los valores ingresados y mostrar el primer error encontrado
  for (let i = 0; i < valores.length; i++) {
    if (isNaN(valores[i])) {
      mostrarError(campos[i].errorId, "Por favor, ingresa un valor numérico válido");
      return;
    }
  }

  // Volumen del cono truncado: V = (π·h / 12) * (D_inf² + D_sup² + D_inf·D_sup)
  const sumaDiametros = dInferior ** 2 + dSuperior ** 2 + dInferior * dSuperior;
  const volumenCono = ((Math.PI * altoCono) / 12) * sumaDiametros;

  // Calculamos el peso del cono en toneladas y kilogramos
  const pesoToneladas = volumenCono * pesoEspecificoCono;
  const pesoKilogramos = pesoToneladas * 1000;

  // Mostramos el resultado en pantalla
  document.getElementById("cono").innerHTML = `${pesoToneladas.toFixed(2)} Ton | ${pesoKilogramos.toFixed(2)} kg`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(altoCono, dSuperior, dInferior, pesoEspecificoCono, volumenCono, pesoToneladas, pesoKilogramos);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(altoCono, dSuperior, dInferior, pesoEspecificoCono, volumenCono, pesoToneladas, pesoKilogramos) {
  const procesoDiv = document.getElementById("procesoCono");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p>1. Calculamos el volumen del cono truncado:</p>
    <p class="formula">Volumen = (π × Altura ÷ 12) × (Diámetro inferior² + Diámetro superior² + Diámetro inferior × Diámetro superior)</p>
    <p class="formula">= (π × ${altoCono} ÷ 12) × (${dInferior}² + ${dSuperior}² + ${dInferior} × ${dSuperior})</p>
    <p class="formula">= ${volumenCono.toFixed(4)} m³</p>
    <p>2. Calculamos el peso en toneladas:</p>
    <p class="formula">Peso (Toneladas) = Volumen × Peso Específico</p>
    <p class="formula">= ${volumenCono.toFixed(4)} m³ × ${pesoEspecificoCono} T/m³</p>
    <p class="formula">= ${pesoToneladas.toFixed(2)} Ton</p>
    <p>3. Convertimos el peso a kilogramos:</p>
    <p class="formula">Peso (Kilogramos) = Peso (Toneladas) × 1000</p>
    <p class="formula">= ${pesoToneladas.toFixed(2)} × 1000</p>
    <p class="formula">= ${pesoKilogramos.toFixed(2)} kg</p>
    `;
  }
  // Mostrar el div de la imagen
  document.getElementById("imagenProceso").style.display = "block";
}

// Función para mostrar mensajes de error
function mostrarError(elementoId, mensaje) {
  ocultarImagen();
  
  // Ocultar todos los mensajes de error
  ["altoError", "diametro_superiorError", "diametro_inferiorError", "peso_materialError"].forEach(ocultarError);

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
