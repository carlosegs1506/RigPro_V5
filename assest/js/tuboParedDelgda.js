//Fuincion para calcula tubo de pared delgada
function calcularPesoTubo() {
  // Obtenemos los valores de los campos del formulario
  const diametro = parseFloat(document.getElementById("diametro").value);
  const largo = parseFloat(document.getElementById("largo").value);
  const espesor = parseFloat(document.getElementById("espesor").value);
  const pesoMaterial = parseFloat(document.getElementById("peso").value); // Peso específico en toneladas métricas

  // Referencias a elementos de error
  const errores = {
    diametroError: document.getElementById("diametroError"),
    largoError: document.getElementById("largoError"),
    espesorError: document.getElementById("espesorError"),
    pesoError: document.getElementById("pesoError"),
  };

  // Función para mostrar la alerta de error para un campo específico
  function mostrarError(campo) {
    Object.values(errores).forEach(error => error.textContent = ""); // Limpiar todos los mensajes de error
    errores[campo].textContent = "Por favor, ingresa un valor numérico válido";
    errores[campo].style.color = "red";
    ocultarImagen(); // Ocultar la imagen en caso de error
  }

  // Función para ocultar las alertas de error
  function ocultarErrores() {
    Object.values(errores).forEach(error => {
      error.textContent = "";
      error.style.color = "initial";
    });
  }

  // Validación y cálculo
  if (isNaN(diametro)) {
    mostrarError("diametroError");
    return;
  }

  if (isNaN(largo)) {
    mostrarError("largoError");
    return;
  }

  if (isNaN(espesor)) {
    mostrarError("espesorError");
    return;
  }

  if (isNaN(pesoMaterial)) {
    mostrarError("pesoError");
    return;
  }

  // Si no hay errores, ocultamos los mensajes de error
  ocultarErrores();

  // Calculamos las variables necesarias
  const pi = Math.PI;
  const pesoTubo = pi * diametro * largo * espesor * (pesoMaterial * 1000); // Convertimos el peso específico a kilogramos

  // Convertimos el peso a toneladas
  const pesoTuboToneladas = pesoTubo / 1000;

  // Mostramos el resultado en pantalla
  document.getElementById("calcularTubo").innerHTML = `${pesoTubo.toFixed(2)} Kg (${pesoTuboToneladas.toFixed(2)} Ton)`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(diametro, largo, espesor, pesoMaterial, pesoTubo);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametro, largo, espesor, pesoMaterial, pesoTubo) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Fórmula y Desarrollo:</h3>
    <p class="formula">Fórmula = Diámetro * PI * Longitud * Espesor * Peso específico </p>
    <p class="formula"> = ${diametro} * ${Math.PI.toFixed(2)} * ${largo} * ${espesor} * ${(pesoMaterial * 1000).toFixed(2)}</p>
    <p class="formula">Peso ≈ ${pesoTubo.toFixed(2)} Kg (${(pesoTubo / 1000).toFixed(2)} Ton)</p>
    `;
  }

  // Mostrar el div de la imagen
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  imagenProcesoDiv.style.display = "block";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  imagenProcesoDiv.style.display = "none";
}

