// Función para el cálculo de tensión eslinga en 90° con centro de gravedad movido
function calculoVerticalMovido() {
  // Obtenemos los valores de los campos del formulario
  const pesoCarga = parseFloat(document.getElementById("peso_carga").value);
  const diferencia1 = parseFloat(document.getElementById("diferencia_1").value);
  const diferencia2 = parseFloat(document.getElementById("diferencia_2").value);

  // Validar los valores ingresados
  const campos = [
    { valor: pesoCarga, errorId: 'peso_cargaError' },
    { valor: diferencia1, errorId: 'diferenca_1Error' },
    { valor: diferencia2, errorId: 'diferencia_2Error' }
  ];

  for (let campo of campos) {
    if (isNaN(campo.valor)) {
      mostrarError(campo.errorId, "Por favor, ingresa un valor numérico válido.");
      return;
    } else {
      ocultarError(campo.errorId);
    }
  }

  // Realizamos el cálculo
  const eslinga1 = (pesoCarga * diferencia2) / (diferencia1 + diferencia2);
  const eslinga2 = (pesoCarga * diferencia1) / (diferencia1 + diferencia2);

  // Mostramos el resultado en pantalla
  document.getElementById("tensionVertical1").innerHTML = eslinga1.toFixed(2) + " Kg";
  document.getElementById("tensionVertical2").innerHTML = eslinga2.toFixed(2) + " Kg";

  // Mostramos el proceso y fórmulas utilizadas
  mostrarProceso(pesoCarga, diferencia1, diferencia2, eslinga1, eslinga2);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(pesoCarga, diferencia1, diferencia2, eslinga1, eslinga2) {
  const procesoDiv = document.getElementById("procesoMovido");
  
  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Fórmulas y Proceso:</h3>
    <p class="formula">Formula Eslinga 1 = PesoCarga * Diferencia 2 / (Diferencia 1 + Diferencia 2)</p>
    <p class="formula">= ${pesoCarga} * ${diferencia2} / (${diferencia1} + ${diferencia2})</p>
    <p class="formula">Tensión 1 = ${eslinga1.toFixed(2)} Kg</p>
    <hr></hr>
    <p class="formula">Formula Eslinga 2 = PesoCarga * Diferencia 1 / (Diferencia 1 + Diferencia 2)</p>
    <p class="formula">= ${pesoCarga} * ${diferencia1} / (${diferencia1} + ${diferencia2})</p>
    <p class="formula">Tensión 2 = ${eslinga2.toFixed(2)} Kg</p>
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

