// Constantes de material (Manual Completo del Rigger, pág. 91-93):
// Acero estructural ASTM A36 -> Fy = 250 MPa
//   Esfuerzo admisible al corte     = 0.4 * Fy = 100 MPa
//   Esfuerzo admisible al aplastamiento = 0.6 * Fy = 150 MPa
// Perno A325 -> Esfuerzo de prueba = 510 MPa
//   Esfuerzo admisible al corte del perno = 0.4 * 510 = 204 MPa
const TAU_ADM_ACERO_MPA = 100;
const SIGMA_ADM_ACERO_MPA = 150;
const TAU_ADM_PERNO_MPA = 204;
const GRAVEDAD = 9.81;

function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// 1) Corte del gramil de la oreja: F = Gramil x Espesor x Tau_adm_acero
function calcularCorteGramil() {
  const gramilInput = document.getElementById("gramilCorte");
  const espesorInput = document.getElementById("espesorCorte");
  const gramilError = document.getElementById("gramilCorteError");
  const espesorError = document.getElementById("espesorCorteError");

  const gramil = parseFloat(gramilInput.value);
  const espesor = parseFloat(espesorInput.value);

  if (isNaN(gramil) || gramil <= 0) {
    mostrarError(gramilError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(gramilError);

  if (isNaN(espesor) || espesor <= 0) {
    mostrarError(espesorError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(espesorError);

  const fuerzaN = gramil * espesor * TAU_ADM_ACERO_MPA;
  const fuerzaKg = fuerzaN / GRAVEDAD;

  document.getElementById("resultadoCorte").innerText = `${fuerzaKg.toFixed(1)} Kg`;

  const procesoDiv = document.getElementById("procesoCorte");
  procesoDiv.innerHTML = `
    <p class="formula">F = Gramil * Espesor * ${TAU_ADM_ACERO_MPA} MPa (0.4 * Fy, acero A36)</p>
    <p class="formula"> = ${gramil} * ${espesor} * ${TAU_ADM_ACERO_MPA} = ${fuerzaN.toFixed(0)} N</p>
    <p class="formula">Resistencia al corte ≈ ${fuerzaN.toFixed(0)} / 9.81 = ${fuerzaKg.toFixed(1)} Kg</p>
    <p style="color:#b45309;"><strong>Atención:</strong> válido solo para acero estructural ASTM A36
    (Fy = 250 MPa). No reemplaza la tabla de carga del fabricante de la oreja.</p>
  `;
}

// 2) Aplastamiento en la perforación: F = Diámetro perforación x Espesor x Sigma_adm_acero
function calcularAplastamiento() {
  const diametroInput = document.getElementById("diametroPerf");
  const espesorInput = document.getElementById("espesorAplastamiento");
  const diametroError = document.getElementById("diametroPerfError");
  const espesorError = document.getElementById("espesorAplastamientoError");

  const diametro = parseFloat(diametroInput.value);
  const espesor = parseFloat(espesorInput.value);

  if (isNaN(diametro) || diametro <= 0) {
    mostrarError(diametroError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(diametroError);

  if (isNaN(espesor) || espesor <= 0) {
    mostrarError(espesorError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(espesorError);

  const fuerzaN = diametro * espesor * SIGMA_ADM_ACERO_MPA;
  const fuerzaKg = fuerzaN / GRAVEDAD;

  document.getElementById("resultadoAplastamiento").innerText = `${fuerzaKg.toFixed(1)} Kg`;

  const procesoDiv = document.getElementById("procesoAplastamiento");
  procesoDiv.innerHTML = `
    <p class="formula">F = Diámetro Perforación * Espesor * ${SIGMA_ADM_ACERO_MPA} MPa (0.6 * Fy, acero A36)</p>
    <p class="formula"> = ${diametro} * ${espesor} * ${SIGMA_ADM_ACERO_MPA} = ${fuerzaN.toFixed(0)} N</p>
    <p class="formula">Resistencia al aplastamiento ≈ ${fuerzaN.toFixed(0)} / 9.81 = ${fuerzaKg.toFixed(1)} Kg</p>
    <p style="color:#b45309;"><strong>Atención:</strong> válido solo para acero estructural ASTM A36
    (Fy = 250 MPa). No reemplaza la tabla de carga del fabricante de la oreja.</p>
  `;
}

// 3) Pernos de la oreja al corte: F = pi * (Diametro/2)^2 * Tau_adm_perno, por N pernos
function calcularPernosCorte() {
  const diametroInput = document.getElementById("diametroPerno");
  const cantidadInput = document.getElementById("cantidadPernos");
  const diametroError = document.getElementById("diametroPernoError");
  const cantidadError = document.getElementById("cantidadPernosError");

  const diametro = parseFloat(diametroInput.value);
  const cantidad = parseFloat(cantidadInput.value);

  if (isNaN(diametro) || diametro <= 0) {
    mostrarError(diametroError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(diametroError);

  if (isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
    mostrarError(cantidadError, "Ingresa un número entero de pernos (mínimo 1).");
    return;
  }
  ocultarError(cantidadError);

  const radio = diametro / 2;
  const area = Math.PI * radio * radio;
  const fuerzaPorPernoN = area * TAU_ADM_PERNO_MPA;
  const fuerzaPorPernoKg = fuerzaPorPernoN / GRAVEDAD;
  const fuerzaTotalKg = fuerzaPorPernoKg * cantidad;

  document.getElementById("resultadoPernos").innerText =
    `${fuerzaPorPernoKg.toFixed(1)} Kg c/u | ${fuerzaTotalKg.toFixed(1)} Kg total (${cantidad} pernos)`;

  const procesoDiv = document.getElementById("procesoPernos");
  procesoDiv.innerHTML = `
    <p class="formula">Área = π * (Diámetro / 2)² = π * ${radio.toFixed(2)}² = ${area.toFixed(1)} mm²</p>
    <p class="formula">F = Área * ${TAU_ADM_PERNO_MPA} MPa (0.4 * Esfuerzo de prueba, perno A325)</p>
    <p class="formula"> = ${area.toFixed(1)} * ${TAU_ADM_PERNO_MPA} = ${fuerzaPorPernoN.toFixed(0)} N por perno</p>
    <p class="formula">Resistencia por perno ≈ ${fuerzaPorPernoN.toFixed(0)} / 9.81 = ${fuerzaPorPernoKg.toFixed(1)} Kg</p>
    <p class="formula">Resistencia total (${cantidad} pernos) ≈ ${fuerzaTotalKg.toFixed(1)} Kg</p>
    <p style="color:#b45309;"><strong>Atención:</strong> válido solo para pernos grado A325
    (esfuerzo de prueba 510 MPa) trabajando en corte simple. No reemplaza la especificación del
    fabricante.</p>
  `;
}
