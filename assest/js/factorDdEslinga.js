// Factor de Eficiencia por Relación D/d (diámetro del objeto de doblez ÷
// diámetro de la eslinga/cable). Tabla estándar de la industria (Crosby y
// fabricantes de eslingas): 1:1=50%, 2:1=60%, 3:1=70%, 4:1=80%.
// La relación es lineal en ese tramo: Eficiencia = 40% + 10% x (D/d),
// acotada entre 50% (D/d <= 1) y 100% (D/d >= 6).
function calcularFactorDd() {
  const dObjetoInput = document.getElementById("dObjeto");
  const dEslingaInput = document.getElementById("dEslinga");
  const capacidadNominalInput = document.getElementById("capacidadNominal");

  const dObjeto = parseFloat(dObjetoInput.value);
  const dEslinga = parseFloat(dEslingaInput.value);
  const capacidadNominalTexto = capacidadNominalInput.value.trim();
  const capacidadNominal = capacidadNominalTexto === "" ? NaN : parseFloat(capacidadNominalTexto);

  const campos = [
    { valor: dObjeto, errorId: "dObjetoError" },
    { valor: dEslinga, errorId: "dEslingaError" }
  ];

  let validacionExitosa = true;
  for (const campo of campos) {
    if (isNaN(campo.valor) || campo.valor <= 0) {
      mostrarError(campo.errorId, "Por favor, ingresa un valor numérico válido mayor a 0.");
      validacionExitosa = false;
      break;
    } else {
      ocultarError(campo.errorId);
    }
  }
  if (!validacionExitosa) return;

  ocultarError("capacidadNominalError");
  if (capacidadNominalTexto !== "" && (isNaN(capacidadNominal) || capacidadNominal <= 0)) {
    mostrarError("capacidadNominalError", "Si ingresas capacidad nominal, debe ser un valor numérico mayor a 0.");
    return;
  }

  const ratio = dObjeto / dEslinga;
  const ratioClamp = Math.max(1, Math.min(ratio, 6));
  const eficiencia = 0.4 + 0.1 * ratioClamp;

  const capacidadReal = !isNaN(capacidadNominal) ? capacidadNominal * eficiencia : null;

  let aviso = "";
  if (ratio < 1) {
    aviso = `<p style="color:#dc2626;"><strong>Atención:</strong> la relación D/d (${ratio.toFixed(2)}) es MENOR a 1:1.
      Doblar una eslinga sobre un objeto más angosto que su propio diámetro no es una práctica recomendada —
      la eficiencia real podría ser incluso menor al 50% mostrado aquí. Usa un pasador/grillete de mayor diámetro.</p>`;
  } else if (ratio > 4) {
    aviso = `<p style="color:#b45309;"><strong>Nota:</strong> para D/d mayores a 4:1 esta calculadora extrapola
      la misma tendencia de la tabla (llegando al 100% en 6:1). Para cables de acero, muchas normas exigen
      relaciones D/d bastante mayores (hasta 25:1) para considerar la eficiencia como 100% — revisa la
      especificación de tu fabricante si trabajas con cable de acero.</p>`;
  }

  document.getElementById("resultadoRatio").innerText = `${ratio.toFixed(2)} : 1`;
  document.getElementById("resultadoEficiencia").innerText = `${(eficiencia * 100).toFixed(0)}%`;
  document.getElementById("resultadoCapacidad").innerText =
    capacidadReal !== null ? `${capacidadReal.toFixed(2)} (misma unidad que la capacidad nominal)` : "— (ingresa la capacidad nominal para verla)";

  mostrarProceso(dObjeto, dEslinga, ratio, eficiencia, capacidadNominal, capacidadReal, aviso);
}

function mostrarProceso(dObjeto, dEslinga, ratio, eficiencia, capacidadNominal, capacidadReal, aviso) {
  const procesoDiv = document.getElementById("procesoDd");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    const pasoCapacidad = capacidadReal !== null
      ? `<p>3. Aplicamos la eficiencia a la capacidad nominal:</p>
         <p class="formula">Capacidad Real = Capacidad Nominal × Eficiencia = ${capacidadNominal} × ${(eficiencia).toFixed(2)} = ${capacidadReal.toFixed(2)}</p>`
      : "";
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmula:</h3>
      <p>1. Calculamos la relación D/d:</p>
      <p class="formula">D/d = Diámetro del objeto ÷ Diámetro de la eslinga = ${dObjeto} ÷ ${dEslinga} = ${ratio.toFixed(2)}</p>
      <p>2. Buscamos la eficiencia según la tabla estándar (interpolada/extrapolada):</p>
      <p class="formula">Eficiencia = 40% + 10% × (D/d) = ${(eficiencia * 100).toFixed(0)}%</p>
      ${pasoCapacidad}
      ${aviso}
      <p style="color:#b45309;"><strong>Referencia:</strong> tabla estándar de la industria — D/d 1:1=50%, 2:1=60%,
      3:1=70%, 4:1=80%. No reemplaza la tabla específica del fabricante de tu eslinga o cable.</p>
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
