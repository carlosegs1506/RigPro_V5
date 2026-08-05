// //Funcion para el calculo de tension eslina lazo simple
// document.addEventListener("DOMContentLoaded", () => {
//   //Obtenemos los datos ingresados
//   const inputCapacidad = document.getElementById("capacidad");
//   const errorCapacidad = document.getElementById("capacidadError");

//   inputCapacidad.addEventListener("input", () => validarCampo(inputCapacidad, errorCapacidad));
//   inputCapacidad.addEventListener("blur", () => validarCampo(inputCapacidad, errorCapacidad));
// });

// //Validamos los campos
// function validarCampo(input, errorElemento) {
//   if (input.value.trim() === "" || isNaN(input.value)) {
//     mostrarError(errorElemento, "Por favor, ingresa un valor numérico válido.");
//     return false;
//   } else {
//     ocultarError(errorElemento);
//     return true;
//   }
// }

// //Realizamos el calculo
// function calculoTensionAhorcadoSimple() {
//   let capacidadAhorcado = parseFloat(document.getElementById("capacidad").value);
//   const errorCapacidad = document.getElementById("capacidadError");

//   if (!validarCampo(document.getElementById("capacidad"), errorCapacidad)) {
//     return;
//   }

//   const tensionAhorcadoSimple = capacidadAhorcado * 0.75;
//   document.getElementById("ahorcadoSimple").innerHTML = tensionAhorcadoSimple.toFixed(2) + " kg";
//   mostrarProceso(capacidadAhorcado, tensionAhorcadoSimple);
// }

// // Función para mostrar el proceso y fórmulas utilizadas
// function mostrarProceso(capacidadAhorcado, tensionAhorcadoSimple) {
//   const procesoDiv = document.getElementById("procesoSimple");
  
//   // Detectar el idioma de la página
//   const lang = document.documentElement.lang;

//   if (lang === "es") {
//     // Texto en español
//     procesoDiv.innerHTML = `
//     <h3>Proceso y Fórmula:</h3>
//     <p class="formula">Fórmula = Capacidad Maniobra * 0.75</p>
//     <p class="formula">= ${capacidadAhorcado} * 0.75</p>
//     <p class="formula">Capacidad ≈ ${tensionAhorcadoSimple.toFixed(2)} Kg</p>
//     `;
//   }

//   // Mostrar el div de la imagen
//   const imagenProcesoDiv = document.getElementById("imagenProceso");
//   imagenProcesoDiv.style.display = "block";
// }

// // Función para ocultar el div de la imagen
// function ocultarImagen() {
//   document.getElementById("imagenProceso").style.display = "none";
// }

// // 

// // Función para ocultar el div de la imagen
// function ocultarImagen() {
//   const imagenProcesoDiv = document.getElementById("imagenProceso");
//   imagenProcesoDiv.style.display = "none";
// }

// // Función para mostrar mensajes de error
// function mostrarError(elemento, mensaje) {
//   elemento.textContent = mensaje;
//   ocultarImagen();
// }

// // Función para ocultar mensajes de error
// function ocultarError(elemento) {
//   elemento.textContent = "";
//   elemento.style.color = "initial";
// }

document.addEventListener("DOMContentLoaded", () => {

  const inputPeso = document.getElementById("peso");
  const inputAngulo = document.getElementById("angulo");

  const errorPeso = document.getElementById("pesoError");
  const errorAngulo = document.getElementById("anguloError");

  inputPeso.addEventListener("input", () =>
    validarCampo(inputPeso, errorPeso)
  );

  inputPeso.addEventListener("blur", () =>
    validarCampo(inputPeso, errorPeso)
  );

  inputAngulo.addEventListener("input", () =>
    validarCampo(inputAngulo, errorAngulo)
  );

  inputAngulo.addEventListener("blur", () =>
    validarCampo(inputAngulo, errorAngulo)
  );

});

//-------------------------------------------

function validarCampo(input, errorElemento) {

  if (input.value.trim() === "" || isNaN(input.value)) {

    mostrarError(errorElemento,
      "Por favor, ingresa un valor numérico válido.");

    return false;

  }

  ocultarError(errorElemento);

  return true;

}

//-------------------------------------------

function calcularTensionLazoSimple() {

  const peso = parseFloat(document.getElementById("peso").value);

  const angulo = parseFloat(document.getElementById("angulo").value);

  const errorPeso = document.getElementById("pesoError");

  const errorAngulo = document.getElementById("anguloError");

  if (!validarCampo(document.getElementById("peso"), errorPeso)) {

    return;

  }

  if (!validarCampo(document.getElementById("angulo"), errorAngulo)) {

    return;

  }

  const radianes = angulo * Math.PI / 180;

  const tension = peso / (2 * Math.sin(radianes));

  document.getElementById("tensionLazo").innerHTML =
    tension.toFixed(2) + " kg";

  mostrarProceso(peso, angulo, tension);

}

//-------------------------------------------

function mostrarProceso(peso, angulo, tension) {

  const procesoDiv = document.getElementById("procesoSimple");

  const lang = document.documentElement.lang;

  if (lang === "es") {

    procesoDiv.innerHTML = `

    <h3>Proceso y Fórmula:</h3>

    <p class="formula">

    Fórmula = Peso ÷ (2 × Sen θ)

    </p>

    <p class="formula">

    = ${peso} ÷ (2 × Sen ${angulo}°)

    </p>

    <p class="formula">

    Tensión ≈ ${tension.toFixed(2)} Kg

    </p>

    `;

  }

  document.getElementById("imagenProceso").style.display = "block";

}

//-------------------------------------------

function ocultarImagen() {

  document.getElementById("imagenProceso").style.display = "none";

}

//-------------------------------------------

function mostrarError(elemento, mensaje) {

  elemento.textContent = mensaje;

  ocultarImagen();

}

//-------------------------------------------

function ocultarError(elemento) {

  elemento.textContent = "";

  elemento.style.color = "initial";

}