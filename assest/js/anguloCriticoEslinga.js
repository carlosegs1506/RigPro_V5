// Función para calcular el ángulo crítico de una eslinga
function calcularAnguloCritico() {
  const numeroRamalesInput = document.getElementById("numeroRamales");
  const anguloRealInput = document.getElementById("anguloReal");
  const numeroRamalesError = document.getElementById("numeroRamalesError");
  const anguloRealError = document.getElementById("anguloRealError");

  const numeroRamales = parseFloat(numeroRamalesInput.value);

  if (isNaN(numeroRamales) || numeroRamales <= 0 || !Number.isInteger(numeroRamales)) {
    mostrarError(numeroRamalesError, "Por favor, ingresa un número entero de ramales (ej: 2, 3, 4).");
    document.getElementById("resultado").innerText = "";
    document.getElementById("procesoDesarrollo").innerHTML = "";
    return;
  }

  ocultarError(numeroRamalesError);

  // Fórmula: Ángulo Crítico (CA) = 60° / N
  // (Manual Riggers, pág. 40: ángulo en el que la tensión del ramal iguala al peso de la carga)
  const anguloCritico = 60 / numeroRamales;

  document.getElementById("resultado").innerText = `${anguloCritico.toFixed(2)} °`;

  // Ángulo real de la eslinga (opcional), para comparar contra el crítico
  let anguloReal = NaN;
  if (anguloRealInput.value.trim() !== "") {
    anguloReal = parseFloat(anguloRealInput.value);
    if (isNaN(anguloReal) || anguloReal <= 0 || anguloReal > 90) {
      mostrarError(anguloRealError, "Ingresa un ángulo real válido entre 0 y 90°, o deja el campo vacío.");
      anguloReal = NaN;
    } else {
      ocultarError(anguloRealError);
    }
  } else {
    ocultarError(anguloRealError);
  }

  mostrarProceso(numeroRamales, anguloCritico, anguloReal);
}

// Función para mostrar el proceso y fórmula utilizada
function mostrarProceso(numeroRamales, anguloCritico, anguloReal) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    let bloqueComparacion = "";

    if (!isNaN(anguloReal)) {
      if (anguloReal < anguloCritico) {
        bloqueComparacion = `
          <p style="color:#dc2626;"><strong>Peligro:</strong> el ángulo real ingresado (${anguloReal}°)
          es MENOR que el ángulo crítico (${anguloCritico.toFixed(2)}°). En esta condición, la tensión
          de cada ramal supera el peso de la carga — no realices la maniobra sin corregir el ángulo o
          ramales.</p>
        `;
      } else {
        bloqueComparacion = `
          <p style="color:#15803d;"><strong>OK:</strong> el ángulo real ingresado (${anguloReal}°)
          es mayor o igual al ángulo crítico (${anguloCritico.toFixed(2)}°), por lo que la tensión de
          cada ramal es menor o igual al peso de la carga.</p>
        `;
      }
    }

    procesoDiv.innerHTML = `
      <h3>Fórmula y Desarrollo:</h3>
      <p class="formula">Fórmula = 60° / Número de Ramales</p>
      <p class="formula"> = 60° / ${numeroRamales}</p>
      <p class="formula">Ángulo Crítico ≈ ${anguloCritico.toFixed(2)} °</p>
      <p>El ángulo crítico es el ángulo mínimo permitido entre los ramales de la eslinga y la
      horizontal de la carga. Por debajo de este ángulo, la tensión de cada ramal supera el peso
      de la carga — nunca trabajes con ángulos menores a este.</p>
      ${bloqueComparacion}
    `;
  }
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
