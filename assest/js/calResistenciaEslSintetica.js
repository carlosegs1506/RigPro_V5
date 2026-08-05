// Ejecutamos la función cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
    // Asignamos el evento al botón cuando el DOM está listo
    document.querySelector(".enviar").addEventListener("click", calcularResistenciaEslinga);
});

function calcularResistenciaEslinga() {
    let resistenciaRoturaInput = document.getElementById("resistenciaRotura");
    let factorSeguridadInput = document.getElementById("factorSeguridad");

    let resistenciaRotura = parseFloat(resistenciaRoturaInput.value);
    let factorSeguridad = parseFloat(factorSeguridadInput.value);

    // Validar los valores ingresados
    const campos = [
        { valor: resistenciaRotura, errorId: 'resistenciaRoturaError' },
        { valor: factorSeguridad, errorId: 'factorSeguridadError' }
    ];

    let validacionExitosa = true;

    for (let campo of campos) {
        if (isNaN(campo.valor) || campo.valor <= 0) {
            mostrarError(campo.errorId, "Por favor, ingresa un valor numérico válido mayor a 0.");
            validacionExitosa = false;
        } else {
            ocultarError(campo.errorId);
        }
    }

    if (!validacionExitosa) return;

    // Fórmula: CMT (Capacidad Máxima de Trabajo) = RR (Resistencia a la Rotura) / FS (Factor de Seguridad)
    const cmt = resistenciaRotura / factorSeguridad;

    // Mostrar el resultado en pantalla
    document.getElementById("resistenciaEslinga").innerHTML = cmt.toFixed(2) + " Kg | Ton según corresponda";

    // Mostrar el proceso y fórmulas utilizadas
    mostrarProceso(resistenciaRotura, factorSeguridad, cmt);
}

function mostrarProceso(resistenciaRotura, factorSeguridad, cmt) {
    const procesoDiv = document.getElementById("procesoResistencia");

    const lang = document.documentElement.lang;

    if (lang === "es") {
        procesoDiv.innerHTML = `
            <h3>Proceso y Fórmula:</h3>
            <p class="formula">CMT = Resistencia a la Rotura (RR) / Factor de Seguridad (FS)</p>
            <p class="formula"> = ${resistenciaRotura} / ${factorSeguridad}</p>
            <p class="formula">CMT ≈ ${cmt.toFixed(2)} Kg | Ton según corresponda</p>
        `;
    }
}

function mostrarError(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.color = "red";
    } else {
        console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
    }
}

function ocultarError(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.textContent = "";
        elemento.style.color = "initial";
    } else {
        console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
    }
}
