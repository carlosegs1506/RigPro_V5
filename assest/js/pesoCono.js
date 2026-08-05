// Función para calcular el volumen y el peso de un cono
function calcularVolumenYPeso() {
    // Obtenemos los valores de los campos del formulario
    const diametroInput = document.getElementById("diametro");
    const alturaInput = document.getElementById("altura");
    const pesoEspecificoInput = document.getElementById("pesoEspecifico");

    const diametro = parseFloat(diametroInput.value);
    const altura = parseFloat(alturaInput.value);
    const pesoEspecifico = parseFloat(pesoEspecificoInput.value);

    // Obtenemos los elementos de error
    const diametroError = document.getElementById("diametroError");
    const alturaError = document.getElementById("alturaError");
    const pesoEspecificoError = document.getElementById("pesoEspecificoError");

    // Validamos los valores ingresados
    if (isNaN(diametro)) {
        mostrarError(diametroError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(altura)) {
        mostrarError(alturaError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(pesoEspecifico)) {
        mostrarError(pesoEspecificoError, "Por favor, ingresa un valor numérico válido.");
        return;
    }

    // Ocultamos los mensajes de error si no hay errores
    ocultarError(diametroError);
    ocultarError(alturaError);
    ocultarError(pesoEspecificoError);

    // Calculamos el volumen del cono
    const volumen = (Math.PI * Math.pow(diametro, 2) / 4) * (altura / 3);

    // Calculamos el peso del cono
    const peso = volumen * pesoEspecifico;

    // Mostramos los resultados en la página
    document.getElementById("volumenResultado").innerText = `${volumen.toFixed(2)} Unidades Cúbicas`;
    document.getElementById("pesoResultado").innerText = `${peso.toFixed(2)} Toneladas Métricas`;

    // Mostrar el proceso y fórmulas utilizadas
  mostrarProceso(diametro, altura, pesoEspecifico, volumen, peso);
  mostrarImagen();
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametro, altura, pesoEspecifico, volumen, peso) {
    const procesoDiv = document.getElementById("procesoCono");
    
    // Detectar el idioma de la página
    const lang = document.documentElement.lang;
  
    if (lang === "es") {
      // Texto en español
      procesoDiv.innerHTML = `
        <h3>Proceso y Fórmulas:</h3>
        <p class="formula">Volumen = Pi * Diametro<sup>2</sup> / 4 * Altura / 3</p>
        <p class="formula"> = ${3.14} * ${diametro}<sup>2</sup> / ${4} * ${altura} / ${3}</p>
        <p class="formula"> Peso = ${volumen.toFixed(2)} * ${pesoEspecifico}</p>
        <p class="formula"> ≈ ${peso.toFixed(2)} Ton</p>
      `;
    }
  
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
document.getElementById("diametro").addEventListener("input", () => {
    const diametro = parseFloat(document.getElementById("diametro").value);
    const diametroError = document.getElementById("diametroError");

    if (isNaN(diametro)) {
        mostrarError(diametroError, "Por favor, ingresa un valor numérico válido.");
    } else {
        ocultarError(diametroError);
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

document.getElementById("pesoEspecifico").addEventListener("input", () => {
    const pesoEspecifico = parseFloat(document.getElementById("pesoEspecifico").value);
    const pesoEspecificoError = document.getElementById("pesoEspecificoError");

    if (isNaN(pesoEspecifico)) {
        mostrarError(pesoEspecificoError, "Por favor, ingresa un valor numérico válido.");
    } else {
        ocultarError(pesoEspecificoError);
    }
});
