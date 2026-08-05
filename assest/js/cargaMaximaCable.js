// Función para calcular la carga máxima de trabajo de un cable de acero
function cargaMaxima() {
    // Obtenemos los valores de los campos del formulario
    const rupturaInput = document.getElementById("esfuerzo");
    const seguridadInput = document.getElementById("factor");
  
    const ruptura = parseFloat(rupturaInput.value);
    const seguridad = parseFloat(seguridadInput.value);
  
    // Validar los valores ingresados
    const campos = [
      { valor: ruptura, errorId: 'esfuerzoError', elemento: rupturaInput },
      { valor: seguridad, errorId: 'factorError', elemento: seguridadInput }
    ];
  
    // Función para mostrar mensajes de error
    function mostrarError(idElemento, mensaje) {
      const elemento = document.getElementById(idElemento);
      if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.color = "red";
      } else {
        console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
      }
    }
  
    // Función para ocultar mensajes de error
    function ocultarError(idElemento) {
      const elemento = document.getElementById(idElemento);
      if (elemento) {
        elemento.textContent = "";
        elemento.style.color = "initial";
      } else {
        console.warn(`Elemento con ID "${idElemento}" no encontrado.`);
      }
    }
  
    let validacionExitosa = true;
  
    // Validación secuencial
    for (let campo of campos) {
      if (isNaN(campo.valor)) {
        mostrarError(campo.errorId, "Por favor, ingresa un valor numérico válido.");
        validacionExitosa = false;
        break;
      } else {
        ocultarError(campo.errorId);
      }
    }
  
    if (!validacionExitosa) return;
  
    // Si no hay errores, ocultar los mensajes de error
    ocultarError("esfuerzoError");
    ocultarError("factorError");
  
    // Realizar el cálculo
    let cargaSegura = ruptura / seguridad;
    let cargaSeguraToneladas = cargaSegura / 1000;
  
    // Mostrar el resultado en pantalla
    document.getElementById("resultado").textContent = `${cargaSegura.toFixed(2)} Kg / ${cargaSeguraToneladas.toFixed(2)} Ton`;
  
    // Mostrar el proceso y fórmulas utilizadas
    mostrarProceso(ruptura, seguridad, cargaSegura, cargaSeguraToneladas);
  }

  // Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(ruptura, seguridad, cargaSegura, cargaSeguraToneladas) {
  const procesoDiv = document.getElementById("procesoCarga");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Fórmula y Proceso:</h3>
      <p class="formula">Carga Máxima de Trabajo (WLL) = Esfuerzo de Ruptura (MBL) ÷ Factor de Seguridad</p>
      <p class="formula"> = ${ruptura} ÷ ${(seguridad).toFixed(2)}</p>
      <p class="formula">Carga Máxima de Trabajo ≈ ${cargaSegura.toFixed(2)} Kg / ${cargaSeguraToneladas.toFixed(2)} Ton</p>
    `;
  }
}

  