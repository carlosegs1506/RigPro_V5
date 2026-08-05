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

// Tabla real de capacidad WIRE ROPE 6x19 IWRC, eslinga de un solo ramal, uso
// axial/vertical (Compendio Torque Capacitaciones, pág. 18), en toneladas.
// Reemplaza la antigua fórmula aproximada "Diámetro x Diámetro x 8", que al
// cotejarla contra esta misma tabla subestimaba el SWL real entre un 15% y
// un 20% en casi todo el rango de diámetros comunes.
const TABLA_SWL_TON = {
  0.25: 0.65,
  0.375: 1.4,
  0.5: 2.5,
  0.625: 3.9,
  0.75: 5.6,
  0.875: 7.6,
  1: 9.8,
  1.125: 12,
  1.25: 15,
  1.375: 18,
  1.5: 21,
  1.75: 28,
  2: 37,
  2.25: 44
};

// Busca el SWL en la tabla real, interpolando linealmente entre los dos
// diámetros conocidos más cercanos cuando el valor ingresado no calza exacto.
function obtenerSwlTabla(diametroPulgadas) {
  const diametros = Object.keys(TABLA_SWL_TON).map(Number).sort((a, b) => a - b);
  const min = diametros[0];
  const max = diametros[diametros.length - 1];

  if (diametroPulgadas <= min) {
    return { swl: TABLA_SWL_TON[min], fueraDeRango: diametroPulgadas < min };
  }
  if (diametroPulgadas >= max) {
    return { swl: TABLA_SWL_TON[max], fueraDeRango: diametroPulgadas > max };
  }

  for (let i = 0; i < diametros.length - 1; i++) {
    const d1 = diametros[i];
    const d2 = diametros[i + 1];
    if (diametroPulgadas >= d1 && diametroPulgadas <= d2) {
      const swl1 = TABLA_SWL_TON[d1];
      const swl2 = TABLA_SWL_TON[d2];
      const swl = swl1 + (swl2 - swl1) * (diametroPulgadas - d1) / (d2 - d1);
      return { swl, fueraDeRango: false };
    }
  }
  return { swl: NaN, fueraDeRango: true };
}

// Función para calcular el SWL (Safe Working Load) del cable de acero
function calcularSwlCable() {
  const diametroInput = document.getElementById("diametro");
  const diametroError = document.getElementById("diametroError");
  const diametro = parseCapacidad(diametroInput.value);

  if (isNaN(diametro) || diametro <= 0) {
    mostrarError(
      diametroError,
      "Por favor, ingresa un valor numérico válido (ej: 7/8, 1 1/2, 2)."
    );
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoDesarrollo").innerHTML = "";
    return;
  }

  ocultarError(diametroError);

  const { swl: resultado, fueraDeRango } = obtenerSwlTabla(diametro);

  document.getElementById("resultado").innerText = `${resultado.toFixed(2)} Ton`;

  mostrarProceso(diametro, resultado, fueraDeRango);
}

// Función para mostrar el proceso y fórmula utilizada
function mostrarProceso(diametro, resultado, fueraDeRango) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    const avisoFueraDeRango = fueraDeRango
      ? `<p style="color:#b45309;"><strong>Atención:</strong> el diámetro ingresado está fuera del
         rango de la tabla (1/4" a 2-1/4"), se usó el valor del extremo más cercano.</p>`
      : "";
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmula:</h3>
      <p>Se busca el SWL en la tabla real de cable de acero 6x19 IWRC, eslinga
      de un ramal en uso vertical/axial (Coeficiente de Seguridad 5:1), interpolando
      si el diámetro no calza exacto con la tabla.</p>
      <p class="formula">Diámetro ingresado: ${diametro.toFixed(3)}"</p>
      <p class="formula">SWL ≈ ${resultado.toFixed(2)} Ton</p>
      ${avisoFueraDeRango}
      <p style="color:#b45309;"><strong>Atención:</strong> esta tabla corresponde a una
      construcción de cable estándar (6x19 IWRC). No reemplaza la tabla de carga del
      fabricante del cable específico que estés usando — úsala siempre como referencia final.</p>
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
