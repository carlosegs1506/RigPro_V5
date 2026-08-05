// Función para convertir unidades de longitud y peso
function convertirUnidades() {
  // Obtenemos los valores de los campos del formulario
  const valor = parseFloat(document.getElementById("valor").value);
  const unidadesOrigen = document.getElementById("unidadesOrigen").value;
  const unidadesDestino = document.getElementById("unidadesDestino").value;
  const resultadoInput = document.getElementById("resultado");
  const valorError = document.getElementById("valorError");

  // Validamos los valores ingresados
  if (isNaN(valor)) {
    mostrarError(valorError, "Por favor, ingresa un valor numérico válido.");
    return;
  }

  // Si no hay errores, ocultar el mensaje de error
  ocultarError(valorError);

  // Factor de cada unidad de longitud respecto al metro
  const factoresLongitud = {
    milimetros: 0.001,
    centimetros: 0.01,
    metros: 1,
    pies: 0.3048,
    pulgadas: 0.0254,
  };

  // Factor de cada unidad de peso respecto al kilogramo
  const factoresPeso = {
    libras: 0.453592,
    kilogramos: 1,
    toneladas: 1000,
  };

  const esLongitud = unidadesOrigen in factoresLongitud && unidadesDestino in factoresLongitud;
  const esPeso = unidadesOrigen in factoresPeso && unidadesDestino in factoresPeso;

  let resultado;
  if (esLongitud) {
    resultado = (valor * factoresLongitud[unidadesOrigen]) / factoresLongitud[unidadesDestino];
  } else if (esPeso) {
    resultado = (valor * factoresPeso[unidadesOrigen]) / factoresPeso[unidadesDestino];
  }

  // Mostrar en pantalla el resultado
  resultadoInput.value = resultado !== undefined
    ? `${resultado.toFixed(4)} ${unidadesDestino}`
    : 'Conversión no disponible (no se puede convertir entre longitud y peso)';
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}
