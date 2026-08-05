// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
  ocultarImagen();  // Ocultar imagen cuando se muestra un error
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  if (imagenProcesoDiv) {
    imagenProcesoDiv.style.display = "none";
  }
}

// Función para calcular la carga lateral
function calcularCargaLateral() {
  // Obtener valores de los campos de entrada
  const densidadViento = parseFloat(document.getElementById('densidad').value);
  const areaReferencia = parseFloat(document.getElementById('area').value);
  const coeficienteArrastre = parseFloat(document.getElementById('coeficiente').value);
  const velocidadViento = parseFloat(document.getElementById('velocidad').value);

  // Verificar que se ingresaron valores válidos y mostrar errores
  const errores = [
    { value: densidadViento, elemento: document.getElementById('densidadError'), mensaje: "Por favor, ingresa un valor numérico válido." },
    { value: areaReferencia, elemento: document.getElementById('areaError'), mensaje: "Por favor, ingresa un valor numérico válido." },
    { value: coeficienteArrastre, elemento: document.getElementById('coeficienteError'), mensaje: "Por favor, ingresa un valor numérico válido." },
    { value: velocidadViento, elemento: document.getElementById('velocidadError'), mensaje: "Por favor, ingresa un valor numérico válido." }
  ];

  for (const { value, elemento, mensaje } of errores) {
    if (isNaN(value)) {
      mostrarError(elemento, mensaje);
      return;
    }
    ocultarError(elemento);
  }

  // Carga Lateral (N) = 0.5 x Densidad del Viento x Área x Coeficiente de Arrastre x Velocidad²
  // Con todos los datos en unidades SI (kg/m³, m², m/s), el resultado de esta ecuación de
  // arrastre aerodinámico sale directamente en Newtons — no en libras.
  const cargaLateralN = 0.5 * densidadViento * areaReferencia * coeficienteArrastre * Math.pow(velocidadViento, 2);
  const cargaLateralKgf = cargaLateralN / 9.81;

  // Mostrar el resultado
  document.getElementById('result').innerText = `${cargaLateralN.toFixed(2)} N (${cargaLateralKgf.toFixed(2)} Kgf)`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(densidadViento, areaReferencia, coeficienteArrastre, velocidadViento, cargaLateralN, cargaLateralKgf);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(densidadViento, areaReferencia, coeficienteArrastre, velocidadViento, cargaLateralN, cargaLateralKgf) {
  const procesoDiv = document.getElementById("procesoLateral");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p class="formula">Carga Lateral (N) = 0.5 × Densidad Viento × Área Referencia × Coeficiente Arrastre × Velocidad Viento²</p>
    <p class="formula">= 0.5 × ${densidadViento} × ${areaReferencia} × ${coeficienteArrastre} × ${velocidadViento}²</p>
    <p class="formula">Carga Lateral ≈ ${cargaLateralN.toFixed(2)} N (${cargaLateralKgf.toFixed(2)} Kgf)</p>
    `;
  }
}


 
