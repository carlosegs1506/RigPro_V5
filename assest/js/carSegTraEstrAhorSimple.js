// Función para calcular la capacidad de estrobo
function calcularCapacidad() {
  // Obtener los valores del campo del formulario
  const capacidadInput = document.getElementById("capacidadEstrobos").value;
  const capacidad = parseCapacidad(capacidadInput);
  const tipoAmarre = document.getElementById("amarre").value;

  // Validar el primer campo
  if (isNaN(capacidad)) {
      mostrarError(document.getElementById("capacidadError"), "Por favor, ingresa un valor numérico válido.");
      ocultarError(document.getElementById("resultado")); // Asegura que el mensaje de resultado no esté visible
      return;
  } else {
      ocultarError(document.getElementById("capacidadError"));
  }

  // Calcular la capacidad según su tipo de amarre
  let resultado;
  if (tipoAmarre === "lazo") {
      resultado = capacidad * capacidad * 9.72 * 0.75;
  } else if (tipoAmarre === "canasta") {
      resultado = capacidad * capacidad * 9.72 * 2;
  } else {
      resultado = capacidad * capacidad * 9.72;
  }

  // Mostrar los resultados en pantalla
  document.getElementById("resultado").innerText = `${resultado.toFixed(2)} Ton`;
}

// Parser seguro de fracciones/decimales de pulgadas. NUNCA usar eval() aquí:
// eval() ejecutaría como código cualquier texto que el usuario escriba en el
// campo, lo cual es un riesgo de seguridad grave (ejecución de código
// arbitrario) en una app publicada en Play Store.
// Admite: "7/8", "1 1/2", "1-1/2", "2", "0.875"
function parseCapacidad(capacidadInput) {
  if (typeof capacidadInput !== "string") return NaN;

  const textoOriginal = capacidadInput.trim();
  if (textoOriginal === "" || textoOriginal.startsWith("-")) return NaN;

  const texto = textoOriginal.replace(/-/g, " ");

  if (!/^[0-9./\s]+$/.test(texto)) return NaN;

  const partes = texto.split(/\s+/).filter(Boolean);
  if (partes.length === 0 || partes.length > 2) return NaN;

  let total = 0;

  for (const parte of partes) {
    if (parte.includes("/")) {
      const segmentos = parte.split("/");
      if (segmentos.length !== 2) return NaN;

      const numerador = Number(segmentos[0]);
      const denominador = Number(segmentos[1]);

      if (
        !Number.isFinite(numerador) ||
        !Number.isFinite(denominador) ||
        denominador === 0
      ) {
        return NaN;
      }

      total += numerador / denominador;
    } else {
      const valor = Number(parte);
      if (!Number.isFinite(valor)) return NaN;
      total += valor;
    }
  }

  return total;
}

// Función para calcular la capacidad segura de trabajo en estrobos lazo simple
function capacidadSeguraAxial() {
  // Obtener los valores de los campos del formulario
  let estrobo = parseFloat(document.getElementById("capacidadAxial").value);

  // Validar el primer campo
  if (isNaN(estrobo)) {
      mostrarError(document.getElementById("estroboError"), "Por favor, ingresa un valor numérico válido.");
      ocultarError(document.getElementById("capacidadSeguraEstroboAxial")); // Asegura que el mensaje de resultado no esté visible
      return;
  } else {
      ocultarError(document.getElementById("estroboError"));
  }

  // Realizar el cálculo
  const capacidadSeguraA = (estrobo * 3) / 4;

  // Mostrar el resultado en pantalla
  document.getElementById("capacidadSeguraEstroboAxial").innerHTML = `${capacidadSeguraA.toFixed(1)} Ton`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(estrobo, capacidadSeguraA);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(estrobo, capacidadSeguraA) {
  const procesoDiv = document.getElementById("procesoSimple");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmulas:</h3>
      <p class="formula">Fórmula = Capacidad * 3 / 4</p>
      <p class="formula"> = ${estrobo} * ${3} / ${4}</p>
      <p class="formula">Capacidad ≈ ${capacidadSeguraA.toFixed(2)} Ton</p>
    `;
  }
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}
