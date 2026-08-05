// Función para calcular el volumen y el peso de una esfera vacía
function calcularVolumenYPeso() {
    // Obtenemos los valores de los campos del formulario
    const diametroInput = document.getElementById("diametro");
    const espesorInput = document.getElementById("espesor");
    const pesoEspecificoInput = document.getElementById("pesoEspecifico");

    const diametro = parseFloat(diametroInput.value);
    const espesor = parseFloat(espesorInput.value);
    const pesoEspecifico = parseFloat(pesoEspecificoInput.value);

    // Obtenemos los elementos de error
    const diametroError = document.getElementById("diametroError");
    const espesorError = document.getElementById("espesorError");
    const pesoEspecificoError = document.getElementById("pesoEspecificoError");

    // Validamos los valores ingresados
    if (isNaN(diametro)) {
        mostrarError(diametroError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(espesor)) {
        mostrarError(espesorError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(pesoEspecifico)) {
        mostrarError(pesoEspecificoError, "Por favor, ingresa un valor numérico válido.");
        return;
    }

    // Ocultamos los mensajes de error si no hay errores
    ocultarError(diametroError);
    ocultarError(espesorError);
    ocultarError(pesoEspecificoError);

    // Volumen (m³) = π x Diámetro (m)² x Espesor (mm) / 1000
    const volumen = Math.PI * Math.pow(diametro, 2) * (espesor / 1000);

    // Calculamos el peso de la esfera vacía
    const peso = volumen * pesoEspecifico;
    const pesoToneladas = peso / 1000;

    // Mostramos los resultados en la página
    document.getElementById("volumenResultado").innerText = `${volumen.toFixed(2)} Mts Cubicos`;
    document.getElementById("pesoResultado").innerText = `${peso.toFixed(2)} Kgs | ${pesoToneladas.toFixed(3)} Ton` ;

    // Mostrar el proceso y fórmulas utilizadas
    mostrarProceso(diametro, espesor, pesoEspecifico, volumen, peso, pesoToneladas);
    mostrarImagen();
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(diametro, espesor, pesoEspecifico, volumen, peso, pesoToneladas) {
    const procesoDiv = document.getElementById("procesoEsfera");
    
    // Detectar el idioma de la página
    const lang = document.documentElement.lang;
  
    if (lang === "es") {
      // Texto en español
      procesoDiv.innerHTML = `
        <h3>Proceso y Fórmulas:</h3>
        <p class="formula">Volumen = π × Diámetro (m)<sup>2</sup> × Espesor (mm) ÷ 1000</p>
        <p class="formula"> = ${Math.PI.toFixed(4)} × ${diametro}<sup>2</sup> × ${espesor} ÷ 1000</p>
        <p class="formula"> = ${volumen.toFixed(2)}</p>
        <p class="formula">Peso = Volumen * Peso Específico</p>
        <p class="formula"> = ${volumen.toFixed(2)} * ${pesoEspecifico}</p>
        <p class="formula"> ≈ ${peso.toFixed(2)} Kgs | ${pesoToneladas.toFixed(3)} Ton</p>
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

document.getElementById("espesor").addEventListener("input", () => {
    const espesor = parseFloat(document.getElementById("espesor").value);
    const espesorError = document.getElementById("espesorError");

    if (isNaN(espesor)) {
        mostrarError(espesorError, "Por favor, ingresa un valor numérico válido.");
    } else {
        ocultarError(espesorError);
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
