// Función para calcular resistencia cadena
function calculoCadena() {
  // Obtenemos los valores de los campos del formulario
  const milimetroCadenaInput = document.getElementById("milimetro");
  const gradoInput = document.getElementById("grado");

  const milimetroCadena = parseFloat(milimetroCadenaInput.value);
  const grado = parseFloat(gradoInput.value);

  // Obtenemos los elementos de error
  const milimetroError = document.getElementById("milimetroError");

  // Validamos los valores ingresados
  if (isNaN(milimetroCadena)) {
    mostrarError(milimetroError, "Por favor, ingresa un valor numérico válido.");
    return;
  } else {
    ocultarError(milimetroError);
  }

  // Calculamos la resistencia de cadena según el valor del grado
  let resistencia = 0;
  const factor = (milimetroCadena / 26) ** 2;
  if (grado === 8) {
    resistencia = factor * 21700;
  } else if (grado === 10) {
    resistencia = factor * 27060;
  }

  // Mostramos el resultado en pantalla
  document.getElementById("resistenciaCadena").innerHTML = resistencia.toFixed(1) + " Kg";

  // Mostramos el proceso y fórmulas utilizadas
  mostrarProceso(milimetroCadena, grado, resistencia);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(milimetroCadena, grado, resistencia) {
  const procesoDiv = document.getElementById("procesoCadenas");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmulas:</h3>
      <p>1. Obtenemos los valores de milímetro cadena (${milimetroCadena} mm) y grado cadena (${grado}).</p>
      <p class="formula">Fórmula Grado 8 = (milímetro / 26)<sup>2</sup> * 21700</p>
      <p class="formula">Fórmula Grado 10 = (milímetro / 26)<sup>2</sup> * 27060</p>
      <p class="formula">Capacidad ≈ ${resistencia.toFixed(1)} Kg</p>
    `;
  }
}

// Función para mostrar error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// Evento para validar el campo de milímetro
document.getElementById("milimetro").addEventListener("input", () => {
  const milimetroCadena = parseFloat(document.getElementById("milimetro").value);
  const milimetroError = document.getElementById("milimetroError");

  if (isNaN(milimetroCadena)) {
    mostrarError(milimetroError, "Por favor, ingresa un valor numérico válido.");
  } else {
    ocultarError(milimetroError);
  }
});
