// Función para calcular el peso de un cilindro macizo
function calcularCilindro() {
  // Obtener los valores de los campos del formulario
  const diametro = parseFloat(document.getElementById("diametro").value);
  const longitud = parseFloat(document.getElementById("longitud").value);
  const peso = parseFloat(document.getElementById("peso").value);

  // Inicializar los elementos de error
  const errores = [
    { campo: diametro, elemento: "diametroError", mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: longitud, elemento: "longitudError", mensaje: "Por favor, ingresa un valor numérico válido." },
    { campo: peso, elemento: "pesoError", mensaje: "Por favor, ingresa un valor numérico válido." }
  ];

  // Mostrar el primer mensaje de error y ocultar los demás
  const errorEncontrado = mostrarErrores(errores);

  // Si hay errores, salir de la función
  if (errorEncontrado) return;

  // Fórmula: Diámetro² x π x Largo ÷ 4 x Peso Específico
  const volumen = (Math.pow(diametro, 2) * Math.PI * longitud) / 4;

  // Convertir peso específico de toneladas métricas a kilogramos
  const pesoKg = peso * 1000;

  // Calcular el peso del cilindro
  const pesoCilindro = volumen * pesoKg;
  const pesoCilindroKg = pesoCilindro.toFixed(2);
  const pesoCilindroToneladas = (pesoCilindro / 1000).toFixed(2);

  // Mostrar el resultado en pantalla
  document.getElementById("calcularC").innerHTML = `${pesoCilindroKg} Kg / ${pesoCilindroToneladas} Ton`;

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(diametro, longitud, volumen, pesoCilindroKg, pesoCilindroToneladas);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametro, longitud, volumen, pesoCilindroKg, pesoCilindroToneladas) {
  const procesoDiv = document.getElementById("procesoDesarrollo");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Fórmula y Desarrollo:</h3>
      <p class="formula">Volumen = Diámetro² × π × Largo ÷ 4</p>
      <p class="formula"> = ${diametro}² × π × ${longitud} ÷ 4</p>
      <p class="formula">Volumen ≈ ${volumen.toFixed(2)} m³</p>
      <p class="formula">Peso = Volumen × Peso Específico</p>
      <p class="formula">Peso ≈ ${pesoCilindroKg} Kg / ${pesoCilindroToneladas} Ton</p>
    `;
  }

  // Mostrar el div de la imagen
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  if (imagenProcesoDiv) {
    imagenProcesoDiv.style.display = "block";
  }
}

// Función para mostrar un mensaje de error en un elemento
function mostrarError(elementoId, mensaje) {
  const errorElement = document.getElementById(elementoId);
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.style.color = "red";
  }
}

// Función para ocultar un mensaje de error
function ocultarError(elementoId) {
  const errorElement = document.getElementById(elementoId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.color = "initial";
  }
}

// Función para mostrar el primer mensaje de error y ocultar los demás
function mostrarErrores(errores) {
  let errorEncontrado = false;

  // Ocultar todos los mensajes de error
  errores.forEach(error => {
    ocultarError(error.elemento);
  });

  // Mostrar el primer mensaje de error
  for (const error of errores) {
    if (isNaN(error.campo)) {
      mostrarError(error.elemento, error.mensaje);
      errorEncontrado = true;
      break; // Salir después de mostrar el primer error
    }
  }

  return errorEncontrado;
}

// Ejecutar la función cuando se hace clic en el botón
document.querySelector(".enviar").addEventListener("click", calcularCilindro);
