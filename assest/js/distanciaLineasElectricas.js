// Distancia mínima de seguridad a líneas eléctricas según voltaje.
// Fuente: Compendio Torque Capacitaciones (pág. 9), Norma ASME B30.5.
// Tabla de brackets regulatorios (NO es una relación continua/interpolable:
// cada tramo de voltaje tiene una distancia mínima fija).
const TABLA_OPERANDO = [
  { max: 50, m: 3.05, ft: 10 },
  { max: 200, m: 4.60, ft: 15 },
  { max: 350, m: 6.10, ft: 20 },
  { max: 500, m: 7.62, ft: 25 },
  { max: 750, m: 10.67, ft: 35 },
  { max: 1000, m: 13.72, ft: 45 }
];

// Nota: la tabla fuente (pág. 9 del manual) no incluye el tramo "sobre 50
// hasta 200 kV" para grúa en movimiento — se deja explícitamente como
// "sin dato" en vez de interpolar un valor de seguridad sin respaldo.
const TABLA_MOVIMIENTO = [
  { max: 0.75, m: 1.22, ft: 4 },
  { max: 50, m: 1.83, ft: 6 },
  { max: 200, m: null, ft: null },
  { max: 350, m: 3.05, ft: 10 },
  { max: 500, m: 4.87, ft: 16 },
  { max: 750, m: 6.10, ft: 20 }
];

function buscarDistancia(tabla, voltaje) {
  for (const fila of tabla) {
    if (voltaje <= fila.max) return fila;
  }
  return null; // fuera de rango de la tabla
}

function calcularDistanciaLinea() {
  const voltajeInput = document.getElementById("voltaje");
  const categoria = document.getElementById("categoria").value;
  const voltaje = parseFloat(voltajeInput.value);

  if (isNaN(voltaje) || voltaje <= 0) {
    mostrarError("voltajeError", "Por favor, ingresa un voltaje válido mayor a 0 (en kV).");
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoDistancia").innerHTML = "";
    return;
  }
  ocultarError("voltajeError");

  const tabla = categoria === "movimiento" ? TABLA_MOVIMIENTO : TABLA_OPERANDO;
  const fila = buscarDistancia(tabla, voltaje);

  if (!fila || fila.m === null) {
    const mensaje = !fila
      ? `El voltaje ingresado (${voltaje} kV) excede el rango de la tabla disponible (hasta 1000 kV operando / 750 kV en movimiento). Consulta a la compañía eléctrica y a la norma ASME B30.5 directamente.`
      : `La tabla fuente no incluye un valor específico para el tramo "sobre 50 hasta 200 kV" en esta categoría. No se muestra un valor para evitar sugerir una distancia sin respaldo — consulta la norma ASME B30.5 o a la compañía eléctrica para este voltaje.`;
    mostrarError("voltajeError", mensaje);
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoDistancia").innerHTML = "";
    return;
  }

  document.getElementById("resultado").innerText = `${fila.m.toFixed(2)} m (${fila.ft} ft)`;
  mostrarProceso(voltaje, categoria, fila);
}

function mostrarProceso(voltaje, categoria, fila) {
  const procesoDiv = document.getElementById("procesoDistancia");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    const nombreCategoria = categoria === "movimiento"
      ? "Grúa en movimiento (con o sin carga, pluma o mástil inclinado)"
      : "Grúa operando cerca de líneas de alto voltaje";
    procesoDiv.innerHTML = `
      <h3>Proceso:</h3>
      <p>Categoría: <strong>${nombreCategoria}</strong></p>
      <p>Voltaje ingresado: ${voltaje} kV → tramo de tabla: hasta ${fila.max} kV</p>
      <p class="formula">Distancia mínima requerida ≈ ${fila.m.toFixed(2)} m (${fila.ft} ft)</p>
      <p style="color:#dc2626;"><strong>Atención:</strong> el contacto directo o el acercamiento a menos de
      esta distancia puede producir electrocución del equipo, el operador y cualquier persona cercana —
      con daños graves o fatales. Si es posible, solicita a la compañía eléctrica el corte del servicio
      durante los trabajos, o protege la línea con una pantalla física.</p>
    `;
  }
}

function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.style.color = "red";
  }
}

function ocultarError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  }
}
