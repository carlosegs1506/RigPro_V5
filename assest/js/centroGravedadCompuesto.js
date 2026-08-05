// Funcion para el calculo de centro de gravedad compuesto (2 o 3 piezas)
document.addEventListener("DOMContentLoaded", function() {
  const inputs = [
    { id: "peso1", errorId: "peso1Error" },
    { id: "distancia1", errorId: "distancia1Error" },
    { id: "peso2", errorId: "peso2Error" },
    { id: "distancia2", errorId: "distancia2Error" },
    { id: "peso3", errorId: "peso3Error" },
    { id: "distancia3", errorId: "distancia3Error" }
  ];

  inputs.forEach(input => {
    document.getElementById(input.id).addEventListener("input", function() {
      if (!isNaN(parseFloat(this.value))) {
        ocultarError(input.errorId);
      }
    });
  });

  document.getElementById("cantidadPiezas").addEventListener("change", actualizarCantidadPiezas);
  actualizarCantidadPiezas();
});

// Muestra/oculta los campos de la pieza 3 según la cantidad de piezas elegida
function actualizarCantidadPiezas() {
  const cantidad = document.getElementById("cantidadPiezas").value;
  const campoPieza3 = document.getElementById("campoPieza3");

  if (cantidad === "3") {
    campoPieza3.style.display = "";
  } else {
    campoPieza3.style.display = "none";
    ocultarError("peso3Error");
    ocultarError("distancia3Error");
  }
}

// Función para el cálculo del centro de gravedad compuesto
function centroGravedadCompuesto() {
  const cantidad = parseInt(document.getElementById("cantidadPiezas").value, 10);

  const pesos = [
    parseFloat(document.getElementById("peso1").value),
    parseFloat(document.getElementById("peso2").value)
  ];
  const distancias = [
    parseFloat(document.getElementById("distancia1").value),
    parseFloat(document.getElementById("distancia2").value)
  ];

  const errores = [
    { valor: pesos[0], id: "peso1Error", mensaje: "Por favor, ingresa un valor numérico válido" },
    { valor: distancias[0], id: "distancia1Error", mensaje: "Por favor, ingresa un valor numérico válido" },
    { valor: pesos[1], id: "peso2Error", mensaje: "Por favor, ingresa un valor numérico válido" },
    { valor: distancias[1], id: "distancia2Error", mensaje: "Por favor, ingresa un valor numérico válido" }
  ];

  if (cantidad === 3) {
    pesos.push(parseFloat(document.getElementById("peso3").value));
    distancias.push(parseFloat(document.getElementById("distancia3").value));
    errores.push({ valor: pesos[2], id: "peso3Error", mensaje: "Por favor, ingresa un valor numérico válido" });
    errores.push({ valor: distancias[2], id: "distancia3Error", mensaje: "Por favor, ingresa un valor numérico válido" });
  }

  // Ocultar todos los mensajes de error antes de la validación
  errores.forEach(error => ocultarError(error.id));

  // Validar los valores ingresados
  for (let i = 0; i < errores.length; i++) {
    if (isNaN(errores[i].valor)) {
      mostrarError(errores[i].id, errores[i].mensaje);
      return;
    }
  }

  // Calculamos las variables necesarias (promedio ponderado)
  const momentos = pesos.map((peso, index) => peso * distancias[index]);
  const resultadoValores = momentos.reduce((acc, curr) => acc + curr, 0);
  const pesoElementos = pesos.reduce((acc, curr) => acc + curr, 0);
  const centroGravedad = resultadoValores / pesoElementos;

  // Mostramos el resultado en la página
  document.getElementById("centroGravedad").innerHTML = centroGravedad.toFixed(2) + " Mts";

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(
    pesos, distancias, momentos, resultadoValores, pesoElementos, centroGravedad
  );
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(pesos, distancias, momentos, resultadoValores, pesoElementos, centroGravedad) {
  const procesoDiv = document.getElementById("procesoCompuesto");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmulas:</h3>
    ${pesos.map((peso, index) => `
      <p>${index + 1}. Peso ${index + 1}: ${peso.toFixed(2)} * Distancia ${index + 1}: ${distancias[index].toFixed(2)} = ${momentos[index].toFixed(2)}</p>
    `).join('')}
    <p class="formula">Suma de pesos total = ${pesos.map(p => p.toFixed(2)).join(' + ')} = ${pesoElementos.toFixed(2)}</p>
    <p class="formula">Centro de Gravedad = Suma de Valores / Peso Total = ${resultadoValores.toFixed(2)} / ${pesoElementos.toFixed(2)}</p>
    <p class="formula">Centro ≈ ${centroGravedad.toFixed(2)} Mts</p>
    `;
  }

  // Mostrar el div de la imagen
  document.getElementById("imagenProceso").style.display = "block";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}

// Función para mostrar errores
function mostrarError(campoErrorId, mensaje) {
  // Ocultar el div de la imagen en caso de error
  ocultarImagen();

  // Ocultar todos los mensajes de error
  ["peso1Error", "distancia1Error", "peso2Error", "distancia2Error", "peso3Error", "distancia3Error"].forEach(id => ocultarError(id));

  // Mostrar el error correspondiente
  const errorElemento = document.getElementById(campoErrorId);
  errorElemento.textContent = mensaje;
  errorElemento.style.color = "red";
}

// Función para ocultar errores
function ocultarError(campoErrorId) {
  const errorElemento = document.getElementById(campoErrorId);
  errorElemento.textContent = "";
  errorElemento.style.color = "initial";
}
