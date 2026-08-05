// Tabla real de fábrica (Crosby G-209, grillete de perno/screw pin — Grado 6)
// Se usa solo como referencia/comparación junto al resultado de la fórmula.
// Diámetro en pulgadas (decimal) -> Capacidad WLL real en toneladas métricas.
const TABLA_GRILLETES_REAL = [
  { pulgadas: 0.375, texto: '3/8"', ton: 1 },
  { pulgadas: 0.5, texto: '1/2"', ton: 2 },
  { pulgadas: 0.625, texto: '5/8"', ton: 3.25 },
  { pulgadas: 0.75, texto: '3/4"', ton: 4.75 },
  { pulgadas: 0.875, texto: '7/8"', ton: 6.5 },
  { pulgadas: 1, texto: '1"', ton: 8.5 },
  { pulgadas: 1.125, texto: '1-1/8"', ton: 9.5 },
  { pulgadas: 1.25, texto: '1-1/4"', ton: 12 },
  { pulgadas: 1.375, texto: '1-3/8"', ton: 13.5 },
  { pulgadas: 1.5, texto: '1-1/2"', ton: 17 },
  { pulgadas: 1.75, texto: '1-3/4"', ton: 25 },
  { pulgadas: 2, texto: '2"', ton: 35 },
  { pulgadas: 2.5, texto: '2-1/2"', ton: 55 },
  { pulgadas: 3, texto: '3"', ton: 85 },
  { pulgadas: 3.5, texto: '3-1/2"', ton: 120 },
  { pulgadas: 4, texto: '4"', ton: 150 }
];

// Busca en la tabla real el tamaño más cercano al valor ingresado
// (tolerancia de 0.02" para admitir pequeños errores de tipeo/redondeo)
function buscarCapacidadReal(pulgadas) {
  let masCercano = null;
  let menorDiferencia = Infinity;

  TABLA_GRILLETES_REAL.forEach((item) => {
    const diferencia = Math.abs(item.pulgadas - pulgadas);
    if (diferencia < menorDiferencia) {
      menorDiferencia = diferencia;
      masCercano = item;
    }
  });

  return menorDiferencia <= 0.02 ? masCercano : null;
}

// Devuelve el valor real de fábrica para el tamaño ingresado:
// - "exacto" si coincide (o casi) con un tamaño de la tabla.
// - "interpolado" si cae entre dos tamaños de la tabla (interpolación lineal
//   sobre la capacidad, para dar siempre un valor real de referencia).
// - null si el tamaño está fuera del rango cubierto por la tabla (< 3/8" o > 4"),
//   caso en el que no hay ningún dato real con el que estimar.
function obtenerCapacidadRealEstimada(pulgadas) {
  const exacto = buscarCapacidadReal(pulgadas);
  if (exacto) {
    return { ton: exacto.ton, texto: exacto.texto, tipo: "exacto" };
  }

  const primero = TABLA_GRILLETES_REAL[0];
  const ultimo = TABLA_GRILLETES_REAL[TABLA_GRILLETES_REAL.length - 1];
  if (pulgadas < primero.pulgadas || pulgadas > ultimo.pulgadas) {
    return null;
  }

  for (let i = 0; i < TABLA_GRILLETES_REAL.length - 1; i++) {
    const actual = TABLA_GRILLETES_REAL[i];
    const siguiente = TABLA_GRILLETES_REAL[i + 1];

    if (pulgadas > actual.pulgadas && pulgadas < siguiente.pulgadas) {
      const proporcion =
        (pulgadas - actual.pulgadas) / (siguiente.pulgadas - actual.pulgadas);
      const tonInterpolado = actual.ton + (siguiente.ton - actual.ton) * proporcion;

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

// Función para el cálculo de capacidad de grillete
function calcularCapacidad() {
  const capacidadErrorEl = document.getElementById("capacidadError");
  const capacidadInput = document.getElementById("capacidad").value;
  const capacidad = parseCapacidad(capacidadInput);

  // Validamos el valor ingresado
  if (isNaN(capacidad) || capacidad <= 0) {
    mostrarError(
      capacidadErrorEl,
      "Por favor, ingresa un valor numérico válido (ej: 7/8, 1 1/2, 2)."
    );
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoDesarrollo").innerHTML = "";
    return;
  }

  ocultarError(capacidadErrorEl);

  // Fórmula del manual: Diámetro x Diámetro x Constante (Manual pág. 15)
  const resultado = capacidad * capacidad * 8.5;

  // Si el tamaño existe (o cae entre dos tamaños) en la tabla real de fábrica,
  // ese es el resultado que se muestra como principal (la fórmula queda como
  // referencia/desarrollo).
  const capacidadReal = obtenerCapacidadRealEstimada(capacidad);
  const resultadoMostrado = capacidadReal ? capacidadReal.ton : resultado;
  const sufijo = capacidadReal
    ? capacidadReal.tipo === "exacto"
      ? "Ton (fábrica)"
      : "Ton (estimado, interpolado)"
    : "Ton (aprox.)";

  document.getElementById("resultado").innerText = `${resultadoMostrado.toFixed(1)} ${sufijo}`;

  mostrarProceso(capacidad, resultado);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(capacidad, resultado) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  const lang = document.documentElement.lang;

  const capacidadReal = obtenerCapacidadRealEstimada(capacidad);

  let bloqueComparacion = "";
  let bloqueAdvertencia = "";

  if (lang === "es") {
    if (capacidadReal) {
      const diferenciaPorc =
        ((resultado - capacidadReal.ton) / capacidadReal.ton) * 100;
      const etiquetaValor =
        capacidadReal.tipo === "exacto"
          ? `grillete de perno ${capacidadReal.texto}`
          : `tamaño ${capacidadReal.texto} (estimado por interpolación entre tamaños de tabla)`;
      bloqueComparacion = `
        <p><strong>Valor real de fábrica (${etiquetaValor}):</strong></p>
        <p class="formula">Capacidad real ≈ ${capacidadReal.ton.toFixed(2)} Ton</p>
        <p class="formula">Diferencia de la fórmula vs. la real ≈ ${diferenciaPorc >= 0 ? "+" : ""}${diferenciaPorc.toFixed(1)}%</p>
      `;

      if (Math.abs(diferenciaPorc) >= 5) {
        const direccion = diferenciaPorc > 0 ? "sobreestima" : "subestima";
        bloqueAdvertencia = `
          <p style="color:#b45309;"><strong>Atención:</strong> para este tamaño, la fórmula
          <strong>${direccion}</strong> la capacidad real en ${Math.abs(diferenciaPorc).toFixed(1)}%.
          Usa siempre el valor marcado en el cuerpo del grillete o la tabla de carga del fabricante
          como referencia final para decidir si es seguro usarlo, nunca solo este cálculo.</p>
        `;
      }
    } else {
      bloqueAdvertencia = `
        <p style="color:#b45309;"><strong>Atención:</strong> este tamaño está fuera del rango
        cubierto por la tabla de fabricante (3/8" a 4"), así que no hay ningún dato real con el
        que comparar. La fórmula puede estar hasta un 20% por encima o por debajo de la capacidad
        real. Usa siempre el valor marcado en el cuerpo del grillete o la tabla de carga del
        fabricante como referencia final.</p>
      `;
    }

    procesoDiv.innerHTML = `
      <h3>Fórmula y Desarrollo:</h3>
      <p class="formula">Formula = Diámetro * Diámetro * 8.5</p>
      <p class="formula"> = ${capacidad.toFixed(3)} * ${capacidad.toFixed(3)} * 8.5</p>
      <p class="formula">Capacidad ≈ ${resultado.toFixed(2)} Ton (valor aproximado, no reemplaza la tabla del fabricante)</p>
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