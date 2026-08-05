// Función para calcular la capacidad de estrobo
function calcularCapacidad() {
  // Obtenemos los valores del campo del formulario
  const capacidadInput = document.getElementById("capacidadEstrobo");
  const capacidad = parseCapacidad(capacidadInput.value);
  const tipoAmarre = document.getElementById("amarre").value;

  // Obtenemos el elemento de error
  const capacidadError = document.getElementById("capacidadError");

  // Validamos el valor ingresado
  if (isNaN(capacidad)) {
    mostrarError(capacidadError, "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Ocultamos el mensaje de error si no hay errores
  ocultarError(capacidadError);

  // Calculamos la capacidad según su tipo de amarre
  let resultado;
  if (capacidad !== null) {
    const factor = capacidad * capacidad * 9.72;
    if (tipoAmarre === "lazo") {
      resultado = factor * 0.75;
    } else if (tipoAmarre === "canasta") {
      resultado = factor * 2;
    } else {
      resultado = factor;
    }

    // Mostramos los resultados en pantalla
    document.getElementById("resultado").innerText = `${resultado.toFixed(2)} Ton`;
  } else {
    // En caso de introducir un valor no numérico, mostramos un error
    document.getElementById("resultado").innerText = "Ingresa una capacidad válida.";
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

// Función para calcular la capacidad segura de trabajo en estrobos
function capacidadSegura() {
  // Obtenemos los valores ingresados
  const anguladaInput = document.getElementById("angulada");
  const largoSeguroInput = document.getElementById("largo");
  const alturaSeguraInput = document.getElementById("altura");

  const angulada = parseFloat(anguladaInput.value);
  const largoSeguro = parseFloat(largoSeguroInput.value);
  const alturaSegura = parseFloat(alturaSeguraInput.value);

  // Obtenemos los elementos de error
  const anguladaError = document.getElementById("anguladaError");
  const largoError = document.getElementById("largoError");
  const alturaError = document.getElementById("alturaError");

  // Validamos los valores ingresados
  if (isNaN(angulada)) {
    mostrarError(anguladaError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  if (isNaN(largoSeguro)) {
    mostrarError(largoError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  if (isNaN(alturaSegura)) {
    mostrarError(alturaError, "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Ocultamos los mensajes de error si no hay errores
  ocultarError(anguladaError);
  ocultarError(largoError);
  ocultarError(alturaError);

  // Calculamos la capacidad segura
  const capacidadSegura = (angulada * largoSeguro) / alturaSegura;

  // Mostramos el resultado en la página
  document.getElementById("capacidadSeguraEstrobo").innerHTML = capacidadSegura.toFixed(1) + " Ton";

  // Mostramos el proceso y fórmulas utilizadas
  mostrarProceso(angulada, largoSeguro, alturaSegura, capacidadSegura);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(angulada, largoSeguro, alturaSegura, capacidadSegura) {
  const procesoDiv = document.getElementById("proceso45");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmula:</h3>
    <p class="formula">Fórmula = Capacidad * Largo / Altura</p>
    <p class="formula">= ${angulada} * ${largoSeguro} / ${alturaSegura}</p>
    <p class="formula">Carga Segura ≈ ${capacidadSegura.toFixed(2)} Ton</p>
    `;
  }
}

// Función para mostrar error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// Eventos para validar los campos antes de calcular
document.getElementById("capacidadEstrobo").addEventListener("input", () => {
  const capacidad = parseCapacidad(document.getElementById("capacidadEstrobo").value);
  const capacidadError = document.getElementById("capacidadError");

  if (isNaN(capacidad)) {
    mostrarError(capacidadError, "Por favor, ingresa un valor numérico válido.");
  } else {
    ocultarError(capacidadError);
  }
});

document.getElementById("angulada").addEventListener("input", () => {
  const angulada = parseFloat(document.getElementById("angulada").value);
  const anguladaError = document.getElementById("anguladaError");

  if (isNaN(angulada)) {
    mostrarError(anguladaError, "Por favor, ingresa un valor numérico válido.");
  } else {
    ocultarError(anguladaError);
  }
});

document.getElementById("largo").addEventListener("input", () => {
  const largoSeguro = parseFloat(document.getElementById("largo").value);
  const largoError = document.getElementById("largoError");

  if (isNaN(largoSeguro)) {
    mostrarError(largoError, "Por favor, ingresa un valor numérico válido.");
  } else {
    ocultarError(largoError);
  }
});

document.getElementById("altura").addEventListener("input", () => {
  const alturaSegura = parseFloat(document.getElementById("altura").value);
  const alturaError = document.getElementById("alturaError");

  if (isNaN(alturaSegura)) {
    mostrarError(alturaError, "Por favor, ingresa un valor numérico válido.");
  } else {
    ocultarError(alturaError);
  }
});
