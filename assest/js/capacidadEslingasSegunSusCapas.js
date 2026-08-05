//Funcionn para el calculo de eslingas segun sus capas
document.addEventListener("DOMContentLoaded", () => {
  const inputColor = document.getElementById("color");
  const inputCapas = document.getElementById("capas");
  const inputAmarre = document.getElementById("amarre");
  const errorResultado = document.getElementById("resultado");

  //Obtenemos los valores seleccionados
  inputColor.addEventListener("input", () => validarCampo(inputColor, errorResultado));
  inputColor.addEventListener("blur", () => validarCampo(inputColor, errorResultado));
  inputCapas.addEventListener("input", () => validarCampo(inputCapas, errorResultado));
  inputCapas.addEventListener("blur", () => validarCampo(inputCapas, errorResultado));
  inputAmarre.addEventListener("input", () => validarCampo(inputAmarre, errorResultado));
  inputAmarre.addEventListener("blur", () => validarCampo(inputAmarre, errorResultado));
});

// Validamos los campos
function validarCampo(input, errorElemento) {
  if (input.value.trim() === "" || (input.id === "capas" && (isNaN(input.value) || input.value < 1 || input.value > 4))) {
    mostrarError(errorElemento, "Por favor, ingresa un valor válido.");
    return false;
  } else {
    ocultarError(errorElemento);
    return true;
  }
}

function calcularCapacidad() {
  const color = document.getElementById("color").value;
  const capas = parseInt(document.getElementById("capas").value);
  const amarre = document.getElementById("amarre").value;
  const errorResultado = document.getElementById("resultado");

  let capacidadBase;

  if (!validarCampo(document.getElementById("color"), errorResultado) ||
      !validarCampo(document.getElementById("capas"), errorResultado) ||
      !validarCampo(document.getElementById("amarre"), errorResultado)) {
    return;
  }

  //Seleccionamos la eslinga segun sus capas y color
  switch (color) {
    case "violeta":
      capacidadBase = 1;
      break;
    case "verde":
      capacidadBase = 2;
      break;
    case "amarillo":
      capacidadBase = 3;
      break;
    case "gris":
      capacidadBase = 4;
      break;
    case "rojo":
      capacidadBase = 5;
      break;
    case "cafe":
      capacidadBase = 6;
      break;
    case "azul":
      capacidadBase = 8;
      break;
    case "naranja_10":
      capacidadBase = 10;
      break;
    case "naranja_12":
      capacidadBase = 12;
      break;
    default:
      mostrarError(errorResultado, "Selecciona un color válido.");
      return;
  }

  if (capas < 1 || capas > 4) {
    mostrarError(errorResultado, "Selecciona un número de capas válido.");
    return;
  }

  //Realizamos el calculo
  let capacidad;

  switch (amarre) {
    case "axial":
      capacidad = capacidadBase * capas * 0.7;
      break;
    case "lazo":
      capacidad = capacidadBase * capas * 0.7 * 0.75;
      break;
    case "canasta":
      capacidad = capacidadBase * capas * 0.7 * 2;
      break;
    default:
      mostrarError(errorResultado, "Selecciona un tipo de amarre válido.");
      return;
  }

  //Mostramos el resultado en pantalla
  document.getElementById("resultado").innerText = `${capacidad.toFixed(1)} Ton.`;
}

function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}
