// Tamaño de placa de apoyo (crib/mat) para estabilizadores de grúa.
// Formula: Area Requerida = (Carga x Factor de Seguridad) / Capacidad Portante del Suelo
// El factor de seguridad (por defecto 1.5) cubre la incertidumbre habitual en la
// estimación de la capacidad portante real del suelo en terreno.
function calcularPlacaApoyo() {
  const cargaInput = document.getElementById("carga");
  const capacidadPortanteInput = document.getElementById("capacidadPortante");
  const factorSeguridadInput = document.getElementById("factorSeguridad");

  const carga = parseFloat(cargaInput.value);
  const capacidadPortante = parseFloat(capacidadPortanteInput.value);
  const factorTexto = factorSeguridadInput.value.trim();
  const factorSeguridad = factorTexto === "" ? 1.5 : parseFloat(factorTexto);

  const campos = [
    { valor: carga, errorId: "cargaError", nombre: "la carga sobre el estabilizador" },
    { valor: capacidadPortante, errorId: "capacidadPortanteError", nombre: "la capacidad portante del suelo" }
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
    document.getElementById("procesoPlaca").innerHTML = "";
    return;
  }

  ocultarError("factorSeguridadError");
  if (factorTexto !== "" && (isNaN(factorSeguridad) || factorSeguridad < 1)) {
    mostrarError("factorSeguridadError", "El factor de seguridad debe ser un número mayor o igual a 1.");
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoPlaca").innerHTML = "";
    return;
  }

  const area = (carga * factorSeguridad) / capacidadPortante;
  const ladoCuadrado = Math.sqrt(area);
  const diametroCircular = Math.sqrt((4 * area) / Math.PI);

  document.getElementById("resultado").innerText = `${area.toFixed(2)} m² (placa cuadrada de ${ladoCuadrado.toFixed(2)} m de lado)`;
  mostrarProceso(carga, capacidadPortante, factorSeguridad, area, ladoCuadrado, diametroCircular);
}

function mostrarProceso(carga, capacidadPortante, factorSeguridad, area, ladoCuadrado, diametroCircular) {
  const procesoDiv = document.getElementById("procesoPlaca");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmula:</h3>
      <p>1. Calculamos el área mínima de apoyo requerida:</p>
      <p class="formula">Área = (Carga × Factor de Seguridad) ÷ Capacidad Portante del Suelo</p>
      <p class="formula">Área = (${carga} × ${factorSeguridad}) ÷ ${capacidadPortante} = ${area.toFixed(2)} m²</p>
      <p>2. Si usas una placa cuadrada:</p>
      <p class="formula">Lado = √Área = √${area.toFixed(2)} = ${ladoCuadrado.toFixed(2)} m</p>
      <p>3. Si usas una placa circular:</p>
      <p class="formula">Diámetro = √(4 × Área ÷ π) = ${diametroCircular.toFixed(2)} m</p>
      <p style="color:#b45309;"><strong>Nota:</strong> la capacidad portante del suelo puede variar mucho según
      humedad, compactación y tipo de terreno — si no tienes un estudio de suelo, consulta valores conservadores
      o usa un factor de seguridad mayor. Esta calculadora no reemplaza un estudio geotécnico en suelos críticos.</p>
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
