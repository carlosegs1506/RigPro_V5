// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
  ocultarImagen(); // Ocultar imagen cuando se muestra un error
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  if (imagenProcesoDiv) {
    imagenProcesoDiv.style.display = "none";
  }
}

// Función para calcular la capacidad de estrobo
function calcularCapacidad() {
  const capacidadInput = document.getElementById("capacidad").value;
  const capacidad = parseCapacidad(capacidadInput);
  const tipoAmarre = document.getElementById("amarre").value;
  const capacidadError = document.getElementById("capacidadError");

  // Validar los valores ingresados
  if (isNaN(capacidad)) {
    mostrarError(capacidadError, "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Ocultar mensajes de error si no hay errores
  ocultarError(capacidadError);

  // Calcular la capacidad según su tipo de amarre
  const resultado = capacidad * capacidad * 9.72 * getFactor(tipoAmarre);

  // Mostrar los resultados en pantalla
  document.getElementById("resultado").innerText = `${resultado.toFixed(2)} Ton`;
}

// Obtener el factor según el tipo de amarre
function getFactor(tipoAmarre) {
  switch (tipoAmarre) {
    case "lazo": return 0.75;
    case "canasta": return 2;
    default: return 1;
  }
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

// Función para calcular la capacidad segura de trabajo en estrobos de canasta vertical simple
function capacidadSeguraVerticalSimple() {
  const simple = parseFloat(document.getElementById("axial").value);
  const axialError = document.getElementById("axialError");

  // Validar los valores ingresados
  if (isNaN(simple)) {
    mostrarError(axialError, "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Ocultar mensajes de error si no hay errores
  ocultarError(axialError);

  // Realizar el cálculo
  const capacidadSeguraVertical = simple * 2;

  // Mostrar el resultado en pantalla
  document.getElementById("capacidadSeguraEstroboVerticalSimple").innerHTML = `${capacidadSeguraVertical.toFixed(1)} Ton`;


  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(simple, capacidadSeguraVertical);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(simple, capacidadSeguraVertical) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmula:</h3>
    <p class="formula">Fórmula = Capacidad * 2</p>
    <p class="formula">= ${simple} * 2</p>
    <p class="formula">Capacidad ≈ ${capacidadSeguraVertical.toFixed(2)} Ton</p>
    `;
  }
}




