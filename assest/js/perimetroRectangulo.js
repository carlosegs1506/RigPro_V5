// Función para calcular el perímetro de un rectángulo
function calcularPerimetro() {
    // Obtenemos los valores de los campos del formulario
    const baseInput = document.getElementById("base");
    const alturaInput = document.getElementById("altura");
    const base = parseFloat(baseInput.value);
    const altura = parseFloat(alturaInput.value);

    // Obtenemos los elementos de error
    const baseError = document.getElementById("baseError");
    const alturaError = document.getElementById("alturaError");

    // Validamos los valores ingresados
    if (isNaN(base)) {
        mostrarError(baseError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(altura)) {
        mostrarError(alturaError, "Por favor, ingresa un valor numérico válido.");
        return;
    }

    // Ocultamos los mensajes de error si no hay errores
    ocultarError(baseError);
    ocultarError(alturaError);

    // Calculamos el perímetro del rectángulo
    const perimetro = 2 * (base + altura);

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

// Eventos para validar los campos antes de calcular
document.getElementById("base").addEventListener("input", () => {
    const base = parseFloat(document.getElementById("base").value);
    const baseError = document.getElementById("baseError");

    if (isNaN(base)) {
        mostrarError(baseError, "Por favor, ingresa un valor numérico válido.");
    } else {
        ocultarError(baseError);
    }
});

document.getElementById("altura").addEventListener("input", () => {
    const altura = parseFloat(document.getElementById("altura").value);
    const alturaError = document.getElementById("alturaError");

    if (isNaN(altura)) {
        mostrarError(alturaError, "Por favor, ingresa un valor numérico válido.");
    } else {
        ocultarError(alturaError);
    }
});
