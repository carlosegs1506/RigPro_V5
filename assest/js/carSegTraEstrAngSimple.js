// Función para calcular la capacidad de estrobo
function calcularCapacidad() {
  // Obtener los valores del campo del formulario
  const capacidadInput = document.getElementById("capacidad").value;
  const capacidad = parseCapacidad(capacidadInput);
  const tipoAmarre = document.getElementById("amarre").value;

  // Validar el campo de capacidad
  if (isNaN(capacidad) || capacidad === "") {
    mostrarError(document.getElementById("capacidadError"), "Por favor, ingresa un valor numérico válido.");
  } else {
    ocultarError(document.getElementById("capacidadError"));
  }

  // Si el valor es válido, calcular la capacidad
  if (!isNaN(capacidad) && capacidad !== "") {
    let resultado;
    if (tipoAmarre === "lazo") {
      resultado = capacidad * capacidad * 9.72 * 0.75;
    } else if (tipoAmarre === "canasta") {
      resultado = capacidad * capacidad * 9.72 * 2;
    } else {
      resultado = capacidad * capacidad * 9.72;
    }

    // Mostrar el resultado en pantalla
    document.getElementById("resultado").innerText = `${resultado.toFixed(2)} Ton`;
  } else {
    document.getElementById("resultado").innerText = "";
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

// Función para calcular la capacidad segura de trabajo en estrobos de canasta angulada simple
function capacidadSeguraVerticalAngulada() {
  // Obtener los valores de los campos del formulario
  let angulada = parseFloat(document.getElementById("angulada").value);
  let altura = parseFloat(document.getElementById("altura").value);
  let largo = parseFloat(document.getElementById("largo").value);

  // Ocultar todas las alertas y resultados al inicio
  ocultarErrores();

  // Validar el campo de angulada
  if (isNaN(angulada) || angulada === "") {
    mostrarError(document.getElementById("anguladaError"), "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Validar el campo de altura
  if (isNaN(altura) || altura === "") {
    mostrarError(document.getElementById("alturaError"), "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Validar el campo de largo
  if (isNaN(largo) || largo === "") {
    mostrarError(document.getElementById("largoError"), "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Realizar el cálculo
  const capacidadSeguraAngulada = ((angulada * altura) / largo) * 2;

  // Mostrar el resultado en pantalla
  document.getElementById("capacidadSeguraEstroboAnguladaSimple").innerHTML = `${capacidadSeguraAngulada.toFixed(1)} Ton`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(angulada, altura, largo, capacidadSeguraAngulada);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(angulada, altura, largo, capacidadSeguraAngulada) {
  const procesoDiv = document.getElementById("procesoSimple");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p class="formula">Fórmula = Capacidad * Altura / Largo * 2</p>
    <p class="formula"> = ${angulada} * ${altura} / ${largo} * ${2}</p>
    <p class="formula">Capacidad ≈ ${capacidadSeguraAngulada.toFixed(2)} Ton</p>
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

// Función para ocultar todos los mensajes de error
function ocultarErrores() {
  ocultarError(document.getElementById("capacidadError"));
  ocultarError(document.getElementById("anguladaError"));
  ocultarError(document.getElementById("alturaError"));
  ocultarError(document.getElementById("largoError"));
}

