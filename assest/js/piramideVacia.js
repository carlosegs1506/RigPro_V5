function calcularVolumenYPeso() {
    // Obtenemos los valores de los campos del formulario
    const alturaAInput = document.getElementById("alturaA");
    const alturaBInput = document.getElementById("alturaB");
    const anchoInput = document.getElementById("ancho");
    const largoInput = document.getElementById("largo");
    const espesorInput = document.getElementById("espesor");
    const pesoEspecificoInput = document.getElementById("pesoEspecifico");

    const alturaA = parseFloat(alturaAInput.value);
    const alturaB = parseFloat(alturaBInput.value);
    const ancho = parseFloat(anchoInput.value);
    const largo = parseFloat(largoInput.value);
    const espesor = parseFloat(espesorInput.value);
    const pesoEspecifico = parseFloat(pesoEspecificoInput.value);

    // Obtenemos los elementos de error
    const alturaAError = document.getElementById("alturaAError");
    const alturaBError = document.getElementById("alturaBError");
    const anchoError = document.getElementById("anchoError");
    const largoError = document.getElementById("largoError");
    const espesorError = document.getElementById("espesorError");
    const pesoEspecificoError = document.getElementById("pesoEspecificoError");

    // Validamos los valores ingresados
    if (isNaN(alturaA) || alturaA <= 0) {
        mostrarError(alturaAError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(alturaB) || alturaB <= 0) {
        mostrarError(alturaBError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(ancho) || ancho <= 0) {
        mostrarError(anchoError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(largo) || largo <= 0) {
        mostrarError(largoError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(espesor) || espesor <= 0) {
        mostrarError(espesorError, "Por favor, ingresa un valor numérico válido.");
        return;
    }
    if (isNaN(pesoEspecifico) || pesoEspecifico <= 0) {
        mostrarError(pesoEspecificoError, "Por favor, ingresa un valor numérico válido.");
        return;
    }

    // Ocultamos los mensajes de error si no hay errores
    ocultarError(alturaAError);
    ocultarError(alturaBError);
    ocultarError(anchoError);
    ocultarError(largoError);
    ocultarError(espesorError);
    ocultarError(pesoEspecificoError);

   // Volumen (m³) = ((Altura A x Ancho) + (Altura B x Largo)) x Espesor (mm) / 1000
    const volumen = ((alturaA * ancho) + (alturaB * largo)) * (espesor / 1000);

    // Calculamos el peso de la pirámide vacía
    const peso = volumen * pesoEspecifico;
    const pesoToneladas = peso / 1000;

    // Mostramos los resultados en la página
    document.getElementById("volumenResultado").innerText = `${volumen.toFixed(3)} m³`;
    document.getElementById("pesoResultado").innerText = `${peso.toFixed(2)} kg | ${pesoToneladas.toFixed(3)} toneladas`;

    // Mostrar el proceso y fórmulas utilizadas
    mostrarProceso(alturaA, alturaB, ancho, largo, espesor, pesoEspecifico, 
        volumen, peso, pesoToneladas);
    mostrarImagen();
}

// Función para mostrar un mensaje de error
function mostrarError(elemento, mensaje) {
    elemento.innerText = mensaje;
    elemento.style.color = "red";
}

// Función para ocultar un mensaje de error
function ocultarError(elemento) {
    elemento.innerText = "";
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(alturaA, alturaB, ancho, largo, espesor, pesoEspecifico, volumen, peso, pesoToneladas) {
    const procesoDiv = document.getElementById("procesoPiramide");
    
    // Detectar el idioma de la página
    const lang = document.documentElement.lang;
  
    if (lang === "es") {
      // Texto en español
      procesoDiv.innerHTML = `
        <h3>Proceso y Fórmulas:</h3>
        <p class="formula">Volumen = ((Altura A × Ancho) + (Altura B × Largo)) × Espesor (mm) ÷ 1000</p>
        <p class="formula"> = ((${alturaA.toFixed(3)} × ${ancho.toFixed(3)}) + (${alturaB.toFixed(3)} × ${largo.toFixed(3)})) × ${espesor.toFixed(3)} ÷ 1000</p>
        <p class="formula"> = ${volumen.toFixed(3)} m³</p>
        <p class="formula">Peso = Volumen * Peso Específico</p>
        <p class="formula"> = ${volumen.toFixed(3)} * ${pesoEspecifico.toFixed(3)}</p>
        <p class="formula"> = ${peso.toFixed(2)} kg | ${pesoToneladas.toFixed(3)} toneladas</p>
      `;
    }
  }

// Función para mostrar la imagen del proceso
function mostrarImagen() {
    const imagenProceso = document.getElementById("imagenProceso");
    imagenProceso.style.display = "block";
}


 