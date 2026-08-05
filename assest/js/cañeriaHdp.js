document.addEventListener("DOMContentLoaded", () => {
  // Asociamos los eventos de validación a cada campo
  const campos = [
    { id: "valor", errorId: "valorError" },
    { id: "diametro", errorId: "diametroError" },
    { id: "espesor", errorId: "espesorError" },
    { id: "largo", errorId: "largoError" }
  ];

  campos.forEach(campo => {
    const input = document.getElementById(campo.id);
    input.addEventListener("input", () => validarCampo(input, document.getElementById(campo.errorId)));
    input.addEventListener("blur", () => validarCampo(input, document.getElementById(campo.errorId)));
  });
});

// Función para validar un campo individualmente
function validarCampo(input, errorElemento) {
  if (input.value.trim() === "") {
    mostrarError(errorElemento, "Por favor, ingresa un valor numérico válido.");
    return false;
  } else {
    ocultarError(errorElemento);
    return true;
  }
}

// Función para convertir unidades de longitud y peso
function convertirUnidades() {
  const valor = parseFloat(document.getElementById("valor").value);
  const unidadesOrigen = document.getElementById("unidadesOrigen").value;
  const unidadesDestino = document.getElementById("unidadesDestino").value;
  const resultadoInput = document.getElementById("resultado");
  const valorError = document.getElementById("valorError");

  if (!validarCampo(document.getElementById("valor"), valorError)) {
    return;
  }

  // Definimos las conversiones en un objeto
  const conversiones = {
    "milimetros": { "metros": 0.001, "centimetros": 0.1, "pulgadas": 0.03937 },
    "centimetros": { "metros": 0.01, "milimetros": 10, "pulgadas": 0.3937 },
    "metros": { "milimetros": 1000, "centimetros": 100, "pulgadas": 39.37 },
    "pulgadas": { "metros": 0.0254, "milimetros": 25.4 },
    "pies": { "metros": 0.3048 },
    "libras": { "kilogramos": 0.453592, "toneladas": 0.000453592 },
    "kilogramos": { "libras": 2.20462, "toneladas": 0.001 }
  };

  const resultado = valor * (conversiones[unidadesOrigen]?.[unidadesDestino] || 0);
  resultadoInput.value = `${resultado.toFixed(2)} ${unidadesDestino}`;
}

// Función para el cálculo de una cañería HDP
function calculoCañeriaHdp() {
  const diametroCañeria = parseFloat(document.getElementById("diametro").value);
  const espesorCañeria = parseFloat(document.getElementById("espesor").value);
  const largoCañeria = parseFloat(document.getElementById("largo").value);

  const diametroError = document.getElementById("diametroError");
  const espesorError = document.getElementById("espesorError");
  const largoError = document.getElementById("largoError");

  if (!validarCampo(document.getElementById("diametro"), diametroError) ||
      !validarCampo(document.getElementById("espesor"), espesorError) ||
      !validarCampo(document.getElementById("largo"), largoError)) {
    return;
  }

  // Peso (kg) = Diámetro (mm) x π x Espesor (mm) x Largo (m) x 1.043 / 1000
  // El divisor pasa de 1.000.000 a 1.000 porque el Largo se ingresa en metros, no en milímetros
  const resultadoCañeriaHdp = Math.abs(
    (diametroCañeria * Math.PI * espesorCañeria * largoCañeria * 1.043) / 1000
  );

  document.getElementById("cañeriaHdp").innerHTML =
    resultadoCañeriaHdp.toFixed(1) + " Kg";

  mostrarProceso(diametroCañeria, espesorCañeria, largoCañeria, resultadoCañeriaHdp);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametroCañeria, espesorCañeria, largoCañeria, resultadoCañeriaHdp) {
  const procesoDiv = document.getElementById("procesoHdp");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
        <h3>Fórmula y Proceso:</h3>
        <p class="formula">Peso (Kg) = Diámetro (mm) × π × Espesor (mm) × Largo (m) × 1.043 ÷ 1000</p>
        <p class="formula">= ${diametroCañeria} × ${Math.PI.toFixed(4)} × ${espesorCañeria} × ${largoCañeria} × 1.043 ÷ 1000</p>
        <p class="formula">Peso Cañería ≈ ${resultadoCañeriaHdp.toFixed(2)} Kg</p>
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

// Función para mostrar errores
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar errores
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}
