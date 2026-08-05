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

// Función para calcular la ráfaga de viento
function calcularRafaga() {
  // Obtenemos valores de los campos de entrada
  const viento10m = parseFloat(document.getElementById('viento').value);
  const alturaTrabajo = parseFloat(document.getElementById('altura').value);
  const vientoError = document.getElementById("vientoError");
  const alturaError = document.getElementById("alturaError");

  // Verificar que se ingresaron valores válidos
  if (!validarValor(viento10m, vientoError, "Por favor, ingresa un valor numérico válido.")) return;
  if (!validarValor(alturaTrabajo, alturaError, "Por favor, ingresa un valor numérico válido.")) return;

  // Factores de velocidad según la altura de trabajo (cada 10 m)
  const factoresVelocidad = {
    10: 1.000,
    20: 1.073,
    30: 1.119,
    40: 1.153,
    50: 1.181,
    60: 1.204,
    70: 1.224,
    80: 1.241,
    90: 1.257,
    100: 1.272,
    110: 1.285,
    120: 1.297,
    130: 1.309,
    140: 1.329,
    150: 1.334,
    160: 1.339,
    170: 1.348,
    180: 1.356,
    190: 1.364,
    200: 1.372
  };

  // Para alturas que no calzan exacto con la tabla (ej: 47 m), interpolamos
  // linealmente entre los dos valores conocidos más cercanos. Antes, cualquier
  // altura no exacta caía silenciosamente en el factor 1.000 (sin corrección),
  // subestimando el viento real a esa altura.
  function obtenerFactorVelocidad(altura) {
    const alturasTabla = Object.keys(factoresVelocidad).map(Number).sort((a, b) => a - b);
    const minAltura = alturasTabla[0];
    const maxAltura = alturasTabla[alturasTabla.length - 1];

    if (altura <= minAltura) return factoresVelocidad[minAltura];
    if (altura >= maxAltura) return factoresVelocidad[maxAltura];

    for (let i = 0; i < alturasTabla.length - 1; i++) {
      const h1 = alturasTabla[i];
      const h2 = alturasTabla[i + 1];
      if (altura >= h1 && altura <= h2) {
        const f1 = factoresVelocidad[h1];
        const f2 = factoresVelocidad[h2];
        return f1 + (f2 - f1) * (altura - h1) / (h2 - h1);
      }
    }
    return 1.000;
  }

  // Obtener el factor de velocidad correspondiente a la altura de trabajo
  const factorVelocidad = obtenerFactorVelocidad(alturaTrabajo);

  // Calcular la velocidad de la ráfaga de viento
  const velocidadRafaga = viento10m * factorVelocidad;

  // Mostrar el resultado
  document.getElementById('result').innerText = velocidadRafaga.toFixed(2) + " m/s";

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(viento10m, factorVelocidad, velocidadRafaga);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(viento10m, factorVelocidad, velocidadRafaga) {
  const procesoDiv = document.getElementById("procesoViento");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p class="formula">Fórmula = Velocidad Viento * Factor Velocidad</p>
    <p class="formula"> = ${viento10m} * ${factorVelocidad}</p>
    <p class="formula">Ráfaga de viento ≈ ${velocidadRafaga.toFixed(2)} m/s</p>
    `;
  }
}