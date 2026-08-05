// Función para calcular el ángulo de trabajo
function alturaAngulo() {
    // Obtenemos los valores de los campos del formulario
    const radioInput = document.getElementById("radio");
    const anguloInput = document.getElementById("angulo");
  
    const radio = parseFloat(radioInput.value);
    const angulo = parseFloat(anguloInput.value);
  
    // Validar los valores ingresados
    const campos = [
      { valor: radio, errorId: 'radioError', elemento: radioInput },
      { valor: angulo, errorId: 'anguloError', elemento: anguloInput }
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
    ocultarError("radioError");
    ocultarError("anguloError");
  
    // Realizar el cálculo
    let anguloEnRadianes = angulo * (Math.PI / 180);
    let altura = radio * Math.tan(anguloEnRadianes);
  
    // Mostrar el resultado en pantalla
    document.getElementById("resultado").textContent = altura.toFixed(2) + " Mts";
  
    // Mostrar el proceso y fórmulas utilizadas
    mostrarProceso(radio, angulo, altura);
  }
  
  // Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(radio, angulo, altura) {
  const procesoDiv = document.getElementById("procesoAltura");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Fórmula y Proceso:</h3>
      <p class="formula">Fórmula = Radio * tan(Ángulo)</p>
      <p class="formula"> = ${radio} * tan(${(angulo * (Math.PI / 180)).toFixed(2)})</p>
      <p class="formula">Altura ≈ ${altura.toFixed(2)} Mts</p>
    `;
  }
}
  
  // Ejecutamos la función cuando se hace clic en el botón
  document.querySelector(".enviar").addEventListener("click", alturaAngulo);
  