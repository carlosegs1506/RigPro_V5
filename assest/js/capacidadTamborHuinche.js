// Capacidad de un tambor de huinche/malacate: cuántos metros de cable de
// acero caben enrollados en el tambor, dado su núcleo, brida, ancho y el
// diámetro del cable. Fórmula estándar de la industria (Crosby / fabricantes
// de huinches), deducida por volumen disponible entre núcleo y brida:
//
//   Volumen disponible = (π/4) × (Brida² − Núcleo²) × Ancho          [mm³]
//   Volumen por metro de cable = (π/4) × Diámetro² × 1000            [mm³/m]
//   Capacidad teórica (m) = (Brida² − Núcleo²) × Ancho / (1000 × Diámetro²)
//
// (el π/4 se cancela). Se aplica además un factor de eficiencia de enrollado
// (por defecto 80%), ya que en la práctica el cable no se acomoda de forma
// perfectamente compacta — quedan espacios entre vueltas y capas.
function calcularCapacidadTambor() {
  const nucleoInput = document.getElementById("nucleo");
  const bridaInput = document.getElementById("brida");
  const anchoInput = document.getElementById("ancho");
  const diametroCableInput = document.getElementById("diametroCable");
  const factorInput = document.getElementById("factorEficiencia");

  const nucleo = parseFloat(nucleoInput.value);
  const brida = parseFloat(bridaInput.value);
  const ancho = parseFloat(anchoInput.value);
  const diametroCable = parseFloat(diametroCableInput.value);
  const factorTexto = factorInput.value.trim();
  const factorEficiencia = factorTexto === "" ? 0.8 : parseFloat(factorTexto) / 100;

  const campos = [
    { valor: nucleo, errorId: "nucleoError", nombre: "el diámetro del núcleo" },
    { valor: brida, errorId: "bridaError", nombre: "el diámetro de la brida" },
    { valor: ancho, errorId: "anchoError", nombre: "el ancho del tambor" },
    { valor: diametroCable, errorId: "diametroCableError", nombre: "el diámetro del cable" }
  ];

  let validacionExitosa = true;
  for (const campo of campos) {
    if (isNaN(campo.valor) || campo.valor <= 0) {
      mostrarError(campo.errorId, `Por favor, ingresa un valor numérico válido mayor a 0 para ${campo.nombre}.`);
      validacionExitosa = false;
    } else {
      ocultarError(campo.errorId);
    }
  }
  if (!validacionExitosa) {
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoTambor").innerHTML = "";
    return;
  }

  if (brida <= nucleo) {
    mostrarError("bridaError", "El diámetro de la brida debe ser mayor al diámetro del núcleo.");
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoTambor").innerHTML = "";
    return;
  }

  ocultarError("factorEficienciaError");
  if (factorTexto !== "" && (isNaN(factorEficiencia) || factorEficiencia <= 0 || factorEficiencia > 1)) {
    mostrarError("factorEficienciaError", "El factor de eficiencia debe ser un porcentaje entre 1 y 100.");
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoTambor").innerHTML = "";
    return;
  }

  const capacidadTeorica = ((brida * brida) - (nucleo * nucleo)) * ancho / (1000 * diametroCable * diametroCable);
  const capacidadReal = capacidadTeorica * factorEficiencia;

  document.getElementById("resultado").innerText = `${capacidadReal.toFixed(1)} m`;
  mostrarProceso(nucleo, brida, ancho, diametroCable, factorEficiencia, capacidadTeorica, capacidadReal);
}

function mostrarProceso(nucleo, brida, ancho, diametroCable, factorEficiencia, capacidadTeorica, capacidadReal) {
  const procesoDiv = document.getElementById("procesoTambor");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmula:</h3>
      <p>1. Calculamos la capacidad teórica según el volumen disponible entre el núcleo y la brida:</p>
      <p class="formula">Capacidad Teórica = (Brida² − Núcleo²) × Ancho ÷ (1000 × Diámetro Cable²)</p>
      <p class="formula">Capacidad Teórica = (${brida}² − ${nucleo}²) × ${ancho} ÷ (1000 × ${diametroCable}²) = ${capacidadTeorica.toFixed(1)} m</p>
      <p>2. Aplicamos el factor de eficiencia de enrollado (espacios entre vueltas y capas):</p>
      <p class="formula">Capacidad Real = Capacidad Teórica × Factor Eficiencia = ${capacidadTeorica.toFixed(1)} × ${factorEficiencia.toFixed(2)} = ${capacidadReal.toFixed(1)} m</p>
      <p style="color:#b45309;"><strong>Nota:</strong> este cálculo es una estimación de referencia. Antes de operar,
      verifica siempre la capacidad real indicada por el fabricante del huinche y en la placa del equipo.</p>
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
