// Función para el cálculo de fuerza centrífuga
function calcularFuerzaCentrifuga() {
  // Obtener valores de los campos de entrada
  const pesoCarga = parseFloat(document.getElementById('peso').value);
  const radio = parseFloat(document.getElementById('radio').value);
  const numeroCarga = parseFloat(document.getElementById('numero').value);
  const altura = parseFloat(document.getElementById('altura').value);

  // Inicializar los elementos de error
  const pesoError = document.getElementById('pesoError');
  const radioError = document.getElementById('radioError');
  const numeroError = document.getElementById('numeroError');
  const alturaError = document.getElementById('alturaError');

  // Validar los valores ingresados y mostrar mensajes de error
  const errores = [
    { campo: pesoCarga, elemento: pesoError, mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: radio, elemento: radioError, mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: numeroCarga, elemento: numeroError, mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: altura, elemento: alturaError, mensaje: "Por favor, ingresa un valor numérico válido." }
  ];

  // Mostrar el primer mensaje de error y ocultar los demás
  const hayErrores = mostrarErrores(errores);

  // Si hay errores, salir de la función
  if (hayErrores) return;

  // Calcular la fuerza centrífuga
  const cargaLateral = pesoCarga * radio / 9.8 * Math.pow(Math.PI * numeroCarga / 30, 2);
  const w = pesoCarga + (cargaLateral * altura / radio);

  // Mostrar el resultado
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = `
      <p>Fuerza Centrífuga: ${cargaLateral.toFixed(2)} Kgf</p>
      <p>Carga Total Equivalente: ${w.toFixed(2)} Kgf</p>
    `;
  }

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(pesoCarga, radio, numeroCarga, altura, cargaLateral, w);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(pesoCarga, radio, numeroCarga, altura, cargaLateral, w) {
  const procesoDiv = document.getElementById("procesoFuerza");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmulas:</h3>
      <p class="formula">Fórmula = peso carga * radio / 9.8 * (π / 30)<sup>2</sup></p>
      <p class="formula"> = ${pesoCarga} * ${radio} / 9.8 * (${numeroCarga} / 30)<sup>2</sup></p>
      <p class="formula"> = ${pesoCarga} + (${cargaLateral.toFixed(2)} * (${altura} / ${radio}))</p>
      <p class="formula">Fuerza Centrífuga ≈ ${w.toFixed(2)} Kgf</p>
    `;
  }
}

// Función para mostrar errores de forma individual
function mostrarErrores(errores) {
  let hayErrores = false;

  // Ocultar todos los mensajes de error
  errores.forEach(error => {
    if (error.elemento) {
      error.elemento.textContent = "";
      error.elemento.style.color = "initial";
    }
  });

  // Mostrar el primer mensaje de error
  for (const error of errores) {
    if (isNaN(error.campo)) {
      if (error.elemento) {
        error.elemento.textContent = error.mensaje;
        error.elemento.style.color = "red";
      }
      hayErrores = true;
      break; // Salir después de mostrar el primer error
    }
  }

  return hayErrores;
}
