// Función para calcular la altura de trabajo
function calcularAlturaTrabajo() {
   // Obtenemos los valores de los campos del formulario
  const largoPlumaInput = document.getElementById("largo");
  const radioInput = document.getElementById("radio");

  const largoPluma = parseFloat(largoPlumaInput.value);
  const radio = parseFloat(radioInput.value);

  // Validar los valores ingresados
  const campos = [
    { valor: largoPluma, errorId: 'largoError', nombre: 'largo' },
    { valor: radio, errorId: 'radioError', nombre: 'radio' }
  ];

  let validacionExitosa = true;

  for (let campo of campos) {
    if (isNaN(campo.valor)) {
      mostrarError(campo.errorId, "Por favor, ingresa un valor numerico valido.");
      validacionExitosa = false;
      break;
    } else {
      ocultarError(campo.errorId);
    }
  }

  if (!validacionExitosa) return;

  if (largoPluma <= radio) {
    mostrarError("largoError", "El largo debe ser mayor que el radio.");
    return;
  }

  // Si no hay errores, ocultar los mensajes de error
  ocultarError("largoError");

  // Realizar el cálculo
  const alturaTrabajo = Math.sqrt(largoPluma ** 2 - radio ** 2);

  // Mostrar el resultado en pantalla
  document.getElementById("alturaTrabajo").innerHTML = alturaTrabajo.toFixed(2) + " mts";

  // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(largoPluma, radio, alturaTrabajo);
  // mostrarImagen();
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(largoPluma, radio, alturaTrabajo) {
  const procesoDiv = document.getElementById("procesoAltura");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
      // Texto en español
      procesoDiv.innerHTML = `
          <h3>Proceso y Fórmulas:</h3>
          <p class="formula">Fórmula = √(Largo de Pluma<sup>2</sup> - Radio<sup>2</sup>)</p>
          <p class="formula"> = √(${largoPluma}^2 - ${radio}^2)</p>
          <p class="formula"> = √(${largoPluma * largoPluma - radio * radio})</p>
          <p class="formula">Altura ≈ ${alturaTrabajo.toFixed(2)} mts</p>
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
function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.style.color = "red";
  } else {
    console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
  }
  ocultarImagen();
}

// Función para ocultar errores
function ocultarError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  } else {
    console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
  }
}

// Ejecutamos la función cuando se hace clic en el botón
document.querySelector(".enviar").addEventListener("click", calcularAlturaTrabajo);

