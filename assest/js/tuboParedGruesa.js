//Funcion para calcular tubo de pared gruesa
function calcularTuboParedConcreto() {
  // Obtenemos los valores de los campos del formulario
  const diametroExterior = parseFloat(document.getElementById("diametro1").value);
  const diametroInterior = parseFloat(document.getElementById("diametro2").value);
  const largo = parseFloat(document.getElementById("largo").value);
  const pesoEspecifico = parseFloat(document.getElementById("peso").value);

  // Referencias a elementos de error
  const errores = {
    diametro1Error: document.getElementById("diametro1Error"),
    diametro2Error: document.getElementById("diametro2Error"),
    largoError: document.getElementById("largoError"),
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
  if (isNaN(diametroExterior)) {
    mostrarError("diametro1Error");
    return;
  }

  if (isNaN(diametroInterior)) {
    mostrarError("diametro2Error");
    return;
  }

  if (isNaN(largo)) {
    mostrarError("largoError");
    return;
  }

  if (isNaN(pesoEspecifico)) {
    mostrarError("pesoError");
    return;
  }

  // Si no hay errores, ocultamos los mensajes de error
  ocultarErrores();

  // Calculamos las variables necesarias
  const radioExterior = Math.pow(diametroExterior / 2, 2);
  const radioInterior = Math.pow(diametroInterior / 2, 2);
  const volumenExterior = radioExterior * Math.PI * largo;
  const volumenInterior = radioInterior * Math.PI * largo;
  const volumenTotal = volumenExterior - volumenInterior;
  const pesoTuboToneladas = volumenTotal * pesoEspecifico;
  const pesoTuboKg = pesoTuboToneladas * 1000;

  // Mostramos el resultado en la página
  document.getElementById("calcularTuboConcreto").innerHTML =
    `${pesoTuboKg.toFixed(1)} Kg / ${pesoTuboToneladas.toFixed(2)} Ton`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(
    diametroExterior,
    diametroInterior,
    largo,
    pesoEspecifico,
    radioExterior,
    radioInterior,
    volumenExterior,
    volumenInterior,
    volumenTotal,
    pesoTuboKg,
    pesoTuboToneladas
  );
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametroExterior,
  diametroInterior,
  largo,
  pesoEspecifico,
  radioExterior,
  radioInterior,
  volumenExterior,
  volumenInterior,
  volumenTotal,
  pesoTuboKg,
  pesoTuboToneladas) {
  const procesoDiv = document.getElementById("procesoDesarrollo");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Fórmula y Desarrollo:</h3>
    <p class="formula">Fórmula Volumen Exterior = (Diámetro Exterior / 2)<sup>2</sup> * PI * largo</p>
    <p class="formula"> = (${(diametroExterior / 2).toFixed(2)})<sup>2</sup> * ${Math.PI.toFixed(2)} * ${largo} = ${volumenExterior.toFixed(2)} m³</p>
    <p class="formula">Fórmula Volumen Interior = (Diámetro Interior / 2)<sup>2</sup> * PI * largo</p>
    <p class="formula"> = (${(diametroInterior / 2).toFixed(2)})<sup>2</sup> * ${Math.PI.toFixed(2)} * ${largo} = ${volumenInterior.toFixed(2)} m³</p>
    <p class="formula">Volumen total = Volumen Exterior - Volumen Interior</p>
    <p class="formula"> = ${volumenExterior.toFixed(2)} - ${volumenInterior.toFixed(2)} = ${volumenTotal.toFixed(2)} m³</p>
    <p class="formula">Peso = Volumen Total * Peso Específico</p>
    <p class="formula"> = ${volumenTotal.toFixed(2)} * ${pesoEspecifico.toFixed(2)} = ${pesoTuboToneladas.toFixed(2)} Ton</p>
    <p class="formula">Peso en kilogramos = ${pesoTuboToneladas.toFixed(2)} * 1000 = ${pesoTuboKg.toFixed(1)} Kg</p>
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
