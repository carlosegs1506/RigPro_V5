// Función para calcular el perímetro de una circunferencia
function calcularPerimetro() {
    // Obtenemos el valor del campo del formulario
    const diametroInput = document.getElementById("diametro");
    const diametro = parseFloat(diametroInput.value);

    // Obtenemos el elemento de error
    const diametroError = document.getElementById("diametroError");

    // Validamos el valor ingresado
    if (isNaN(diametro)) {
        mostrarError(diametroError, "Por favor, ingresa un valor numérico válido.");
        return;
    }

    // Ocultamos el mensaje de error si no hay errores
    ocultarError(diametroError);

    // Calculamos el perímetro de la circunferencia
    const perimetro = Math.PI * diametro;

    // Obtenemos el idioma de la página
    const lang = document.documentElement.lang;

    // Mostramos el resultado en el idioma correspondiente
    let resultadoTexto = "";
    if (lang === "es") {
        resultadoTexto = `${perimetro.toFixed(2)} metros (Medida según corresponda)`;
    }

// Mostramos el resultado en la página
    document.getElementById("resultado").innerText = resultadoTexto;

// Mostrar el div de la imagen
  document.getElementById("imagenProceso").style.display = "block";
}

// Función para mostrar el div de la imagen
function mostrarImagen() {
    document.getElementById("imagenProceso").style.display = "block";
  }
  
  // Función para ocultar el div de la imagen
  function ocultarImagen() {
    document.getElementById("imagenProceso").style.display = "none";
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

// Evento para validar el campo antes de calcular
document.getElementById("diametro").addEventListener("input", () => {
    const diametro = parseFloat(document.getElementById("diametro").value);
    const diametroError = document.getElementById("diametroError");

    if (isNaN(diametro)) {
        mostrarError(diametroError, "Por favor, ingresa un valor numérico válido.");
    } else {
        ocultarError(diametroError);
    }
});
