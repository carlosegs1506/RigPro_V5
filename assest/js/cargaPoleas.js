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

// Tabla de Factor de Fricción al 3% por polea (rodamiento en cable de acero).
// Cada valor es la suma acumulada 0.97^1 + 0.97^2 + ... + 0.97^n: representa
// cuánta carga soportan realmente "n" líneas una vez descontada la fricción
// progresiva de cada polea adicional.
const FACTORES_FRICCION = [null, 0.97, 1.91, 2.83, 3.72, 4.58, 5.42, 6.23, 7.02, 7.79, 8.53, 9.25, 9.95];

// Función para calcular las líneas de carga
function calcularLineasCarga() {
  // Obtener valores de los campos del formulario
  const cargaElemento = parseFloat(document.getElementById('carga').value);
  const capacidadCable = parseFloat(document.getElementById('capacidad').value);

  // Validar los valores ingresados y mostrar errores
  const errores = [
    { value: cargaElemento, elemento: document.getElementById('cargaError'), mensaje: "Por favor, ingresa un valor numérico válido." },
    { value: capacidadCable, elemento: document.getElementById('capacidadError'), mensaje: "Por favor, ingresa un valor numérico válido." }
  ];

  for (const { value, elemento, mensaje } of errores) {
    if (isNaN(value)) {
      mostrarError(elemento, mensaje);
      return;
    }
    ocultarError(elemento);
  }

  // Líneas teóricas sin considerar la fricción de las poleas (solo referencial)
  const lineasTeoricas = cargaElemento / capacidadCable;

  // Líneas realmente necesarias: la menor cantidad "n" (1 a 12) cuya capacidad
  // ajustada por el Factor de Fricción alcance a soportar la carga.
  let lineasNecesarias = null;
  for (let n = 1; n <= 12; n++) {
    if (capacidadCable * FACTORES_FRICCION[n] >= cargaElemento) {
      lineasNecesarias = n;
      break;
    }
  }

  if (lineasNecesarias === null) {
    document.getElementById('result').innerHTML =
      `La carga excede lo que soportan 12 líneas con este factor de fricción (${(capacidadCable * FACTORES_FRICCION[12]).toFixed(2)} Kg máx)`;
  } else {
    document.getElementById('result').innerHTML =
      `${lineasNecesarias} líneas (teórico sin fricción: ${lineasTeoricas.toFixed(2)})`;
  }

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(cargaElemento, capacidadCable, lineasTeoricas, lineasNecesarias);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(cargaElemento, capacidadCable, lineasTeoricas, lineasNecesarias) {
  const procesoDiv = document.getElementById("procesoPoleas");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    const filaUsada = lineasNecesarias
      ? `<p class="formula">Buscamos en la tabla la menor cantidad de líneas (N) cuya Capacidad × Factor de Fricción alcance la Carga:</p>
         <p class="formula">Capacidad × Factor de Fricción(${lineasNecesarias}) = ${capacidadCable} × ${FACTORES_FRICCION[lineasNecesarias]} = ${(capacidadCable * FACTORES_FRICCION[lineasNecesarias]).toFixed(2)} Kg ≥ ${cargaElemento} Kg</p>
         <p class="formula">Líneas de Carga necesarias = ${lineasNecesarias}</p>`
      : `<p class="formula">Ni siquiera 12 líneas alcanzan a soportar la carga considerando la fricción del 3% por polea.</p>`;

    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Fórmulas:</h3>
    <p>1. Líneas teóricas, sin considerar la fricción de las poleas (solo referencial):</p>
    <p class="formula">Líneas teóricas = Carga ÷ Capacidad del Cable = ${cargaElemento} ÷ ${capacidadCable} = ${lineasTeoricas.toFixed(2)}</p>
    <p>2. Líneas de carga reales, considerando el Factor de Fricción al 3% por polea:</p>
    ${filaUsada}
    `;
  }
}




