// Función para calcular el diámetro de un cilindro hueco de pared delgada
// a partir de su peso conocido (ej: cilindro de hormigón armado).
function calcularDiametro() {
  const pesoInput = document.getElementById("peso");
  const pesoEspecificoInput = document.getElementById("pesoEspecifico");
  const largoInput = document.getElementById("largo");
  const espesorInput = document.getElementById("espesor");

  const peso = parseFloat(pesoInput.value);
  const pesoEspecifico = parseFloat(pesoEspecificoInput.value);
  const largo = parseFloat(largoInput.value);
  const espesor = parseFloat(espesorInput.value);

  const campos = [
    { valor: peso, errorId: "pesoError" },
    { valor: pesoEspecifico, errorId: "pesoEspecificoError" },
    { valor: largo, errorId: "largoError" },
    { valor: espesor, errorId: "espesorError" },
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

  // Fórmula (pared delgada): Diámetro = Peso ÷ Peso Específico ÷ π ÷ Largo ÷ Espesor
  const diametro = peso / pesoEspecifico / Math.PI / largo / espesor;

  document.getElementById("resultado").innerText = `${diametro.toFixed(3)} mts`;

  mostrarProceso(peso, pesoEspecifico, largo, espesor, diametro);
}

// Función para mostrar el proceso y fórmula utilizada
function mostrarProceso(peso, pesoEspecifico, largo, espesor, diametro) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    procesoDiv.innerHTML = `
      <h3>Fórmula y Desarrollo:</h3>
      <p class="formula">Diámetro = Peso ÷ Peso Específico ÷ π ÷ Largo ÷ Espesor</p>
      <p class="formula"> = ${peso} ÷ ${pesoEspecifico} ÷ π ÷ ${largo} ÷ ${espesor}</p>
      <p class="formula">Diámetro ≈ ${diametro.toFixed(3)} mts</p>
      <p style="color:#b45309;"><strong>Atención:</strong> esta fórmula asume pared delgada
      (espesor pequeño en relación al diámetro). Para tubos de pared gruesa, usa la calculadora
      "Peso Cilindro Hueco" con diámetro exterior/interior conocidos — es más precisa.</p>
    `;
  }
}

// Función para mostrar mensajes de error
function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.style.color = "red";
  }
}

// Función para ocultar mensajes de error
function ocultarError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  }
}
