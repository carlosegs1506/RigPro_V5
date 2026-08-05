// Función para calcular el perímetro de un cuadrado
function calcularPerimetro() {
    // Obtenemos el valor del campo del formulario
    const ladoInput = document.getElementById("lado");
    const lado = parseFloat(ladoInput.value);

    // Obtenemos el elemento de error
    const ladoError = document.getElementById("ladoError");

    // Validamos el valor ingresado
    if (isNaN(lado)) {
        mostrarError(ladoError, "Por favor, ingresa un valor numérico válido.");
        return;
    }

    // Ocultamos el mensaje de error si no hay errores
    ocultarError(ladoError);

    // Calculamos el perímetro del cuadrado
    const perimetro = 4 * lado;

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
document.getElementById("lado").addEventListener("input", () => {
    const lado = parseFloat(document.getElementById("lado").value);
    const ladoError = document.getElementById("ladoError");

    if (isNaN(lado)) {
        mostrarError(ladoError, "Por favor, ingresa un valor numérico válido.");
    } else {
        ocultarError(ladoError);
    }
});
