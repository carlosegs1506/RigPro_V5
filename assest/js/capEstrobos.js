// Tabla real de fábrica (estrobo de cable de acero 6x19/6x37 IWRC, un solo tramo,
// factor de diseño 5:1 — valores típicos de catálogo de fabricante).
// Se usa solo como referencia/comparación junto al resultado de la fórmula.
// Diámetro en pulgadas (decimal) -> Capacidad WLL real en toneladas, por tipo de amarre.
const TABLA_ESTROBOS_REAL = [
  { pulgadas: 0.25, texto: '1/4"', axial: 0.65, lazo: 0.48, canasta: 1.3 },
  { pulgadas: 0.375, texto: '3/8"', axial: 1.4, lazo: 1.1, canasta: 2.9 },
  { pulgadas: 0.5, texto: '1/2"', axial: 2.5, lazo: 1.9, canasta: 5.1 },
  { pulgadas: 0.625, texto: '5/8"', axial: 3.9, lazo: 2.9, canasta: 7.8 },
  { pulgadas: 0.75, texto: '3/4"', axial: 5.6, lazo: 4.1, canasta: 11 },
  { pulgadas: 0.875, texto: '7/8"', axial: 7.6, lazo: 5.6, canasta: 15 },
  { pulgadas: 1, texto: '1"', axial: 9.8, lazo: 7.2, canasta: 20 },
  { pulgadas: 1.125, texto: '1-1/8"', axial: 12, lazo: 9.1, canasta: 24 },
  { pulgadas: 1.25, texto: '1-1/4"', axial: 15, lazo: 11, canasta: 30 },
  { pulgadas: 1.375, texto: '1-3/8"', axial: 18, lazo: 13, canasta: 36 },
  { pulgadas: 1.5, texto: '1-1/2"', axial: 21, lazo: 16, canasta: 42 },
  { pulgadas: 1.75, texto: '1-3/4"', axial: 28, lazo: 21, canasta: 57 },
  { pulgadas: 2, texto: '2"', axial: 37, lazo: 28, canasta: 73 },
  { pulgadas: 2.25, texto: '2-1/4"', axial: 44, lazo: 35, canasta: 89 },
];

// Busca en la tabla real el tamaño más cercano al valor ingresado
// (tolerancia de 0.02" para admitir pequeños errores de tipeo/redondeo)
function buscarEstroboReal(pulgadas) {
  let masCercano = null;
  let menorDiferencia = Infinity;

  TABLA_ESTROBOS_REAL.forEach((item) => {
    const diferencia = Math.abs(item.pulgadas - pulgadas);
    if (diferencia < menorDiferencia) {
      menorDiferencia = diferencia;
      masCercano = item;
    }
  });

  return menorDiferencia <= 0.02 ? masCercano : null;
}

// Devuelve el valor real de fábrica para el tamaño y tipo de amarre ingresados:
// - "exacto" si coincide (o casi) con un tamaño de la tabla.
// - "interpolado" si cae entre dos tamaños de la tabla (interpolación lineal
//   sobre la capacidad, para dar siempre un valor real de referencia).
// - null si el tamaño está fuera del rango cubierto por la tabla (< 1/4" o > 2-1/4"),
//   caso en el que no hay ningún dato real con el que estimar.
function obtenerCapacidadRealEstimada(pulgadas, tipoAmarre) {
  const exacto = buscarEstroboReal(pulgadas);
  if (exacto) {
    return { ton: exacto[tipoAmarre], texto: exacto.texto, tipo: "exacto" };
  }

  const primero = TABLA_ESTROBOS_REAL[0];
  const ultimo = TABLA_ESTROBOS_REAL[TABLA_ESTROBOS_REAL.length - 1];
  if (pulgadas < primero.pulgadas || pulgadas > ultimo.pulgadas) {
    return null;
  }

  for (let i = 0; i < TABLA_ESTROBOS_REAL.length - 1; i++) {
    const actual = TABLA_ESTROBOS_REAL[i];
    const siguiente = TABLA_ESTROBOS_REAL[i + 1];

    if (pulgadas > actual.pulgadas && pulgadas < siguiente.pulgadas) {
      const proporcion =
        (pulgadas - actual.pulgadas) / (siguiente.pulgadas - actual.pulgadas);
      const tonInterpolado =
        actual[tipoAmarre] + (siguiente[tipoAmarre] - actual[tipoAmarre]) * proporcion;

      return {
        ton: tonInterpolado,
        texto: `entre ${actual.texto} y ${siguiente.texto}`,
        tipo: "interpolado",
      };
    }
  }

  return null;
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

  // Solo se permiten dígitos, espacios, puntos y una barra de fracción.
  // Cualquier otro caracter (letras, símbolos, paréntesis, etc.) es inválido.
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

// Función para calcular la capacidad de estrobo
function calcularCapacidad() {
  // Obtenemos los valores del campo del formulario
  const capacidadInput = document.getElementById("capacidad");
  const capacidad = parseCapacidad(capacidadInput.value);
  const tipoAmarre = document.getElementById("amarre").value;
  const capacidadError = document.getElementById("capacidadError");

  // Validar los valores ingresados
  if (isNaN(capacidad) || capacidad <= 0) {
    mostrarError(capacidadError, "Por favor, ingresa un valor numérico válido (ej: 7/8, 1 1/2, 2).");
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoEstrobo").innerHTML = "";
    return;
  }

  // Ocultar mensajes de error si no hay errores
  ocultarError(capacidadError);

  // Fórmula: Diámetro x Diámetro x Constante, según el tipo de amarre
  const factor = 9.72;
  let resultado = capacidad * capacidad * factor;
  if (tipoAmarre === "lazo") {
    resultado *= 0.75;
  } else if (tipoAmarre === "canasta") {
    resultado *= 2;
  }

  // Si el tamaño existe (o cae entre dos tamaños) en la tabla real de fábrica,
  // ese es el resultado que se muestra como principal (la fórmula queda como
  // referencia/desarrollo).
  const capacidadReal = obtenerCapacidadRealEstimada(capacidad, tipoAmarre);
  const resultadoMostrado = capacidadReal ? capacidadReal.ton : resultado;
  const sufijo = capacidadReal
    ? capacidadReal.tipo === "exacto"
      ? "Ton (fábrica)"
      : "Ton (estimado, interpolado)"
    : "Ton (aprox.)";

  // Mostrar el resultado en pantalla
  document.getElementById("resultado").innerText = `${resultadoMostrado.toFixed(2)} ${sufijo}`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(capacidad, resultado, tipoAmarre, capacidadReal);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(capacidad, resultado, tipoAmarre, capacidadReal) {
  const procesoDiv = document.getElementById("procesoEstrobo");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    let bloqueComparacion = "";
    let bloqueAdvertencia = "";
    const nombreAmarre = { axial: "Axial", lazo: "Lazo", canasta: "Canasta" }[tipoAmarre];

    if (capacidadReal) {
      const diferenciaPorc = ((resultado - capacidadReal.ton) / capacidadReal.ton) * 100;
      const etiquetaValor =
        capacidadReal.tipo === "exacto"
          ? `estrobo ${capacidadReal.texto}`
          : `tamaño ${capacidadReal.texto} (estimado por interpolación entre tamaños de tabla)`;
      bloqueComparacion = `
        <p><strong>Valor real de fábrica (${etiquetaValor}, amarre ${nombreAmarre}):</strong></p>
        <p class="formula">Capacidad real ≈ ${capacidadReal.ton.toFixed(2)} Ton</p>
        <p class="formula">Diferencia de la fórmula vs. la real ≈ ${diferenciaPorc >= 0 ? "+" : ""}${diferenciaPorc.toFixed(1)}%</p>
      `;

      if (Math.abs(diferenciaPorc) >= 5) {
        const direccion = diferenciaPorc > 0 ? "sobreestima" : "subestima";
        bloqueAdvertencia = `
          <p style="color:#b45309;"><strong>Atención:</strong> para este tamaño, la fórmula
          <strong>${direccion}</strong> la capacidad real en ${Math.abs(diferenciaPorc).toFixed(1)}%.
          Usa siempre el valor marcado en el estrobo o la tabla de carga del fabricante
          como referencia final para decidir si es seguro usarlo, nunca solo este cálculo.</p>
        `;
      }
    } else {
      bloqueAdvertencia = `
        <p style="color:#b45309;"><strong>Atención:</strong> este tamaño está fuera del rango
        cubierto por la tabla de fabricante (1/4" a 2-1/4"), así que no hay ningún dato real con el
        que comparar. Usa siempre el valor marcado en el estrobo o la tabla de carga del
        fabricante como referencia final.</p>
      `;
    }

    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmula:</h3>
    <p class="formula">
    Fórmula = <br>
    Axial = ${capacidad.toFixed(3)} * ${capacidad.toFixed(3)} * ${9.72}
    <br>
    Lazo = ${capacidad.toFixed(3)} * ${capacidad.toFixed(3)} * ${9.72} * ${0.75}
    <br>
    Canasta = ${capacidad.toFixed(3)} * ${capacidad.toFixed(3)} * ${9.72} * ${2}
    <br>
    </p>
    <p class="formula">Capacidad (${nombreAmarre}) ≈ ${resultado.toFixed(2)} Ton (valor aproximado, no reemplaza la tabla del fabricante)</p>
    ${bloqueComparacion}
    ${bloqueAdvertencia}
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

// Evento para validar el campo de capacidad en tiempo real
document.getElementById("capacidad").addEventListener("input", () => {
  const capacidad = parseCapacidad(document.getElementById("capacidad").value);
  const capacidadError = document.getElementById("capacidadError");

  if (isNaN(capacidad) || capacidad <= 0) {
    mostrarError(capacidadError, "Por favor, ingresa un valor numérico válido (ej: 7/8, 1 1/2, 2).");
  } else {
    ocultarError(capacidadError);
  }
});
