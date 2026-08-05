// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
  ocultarImagen();
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  document.getElementById("imagenProceso").style.display = "none";
}

// Función para calcular el ángulo de trabajo o maniobra
function calcularAngulo() {
  const radioInput = document.getElementById("radio");
  const largoInput = document.getElementById("largo");
  const radioError = document.getElementById("radioError");
  const largoError = document.getElementById("largoError");

  const radio = parseFloat(radioInput.value);
  const largo = parseFloat(largoInput.value);

  if (isNaN(radio)) {
    mostrarError(radioError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(radioError);

  if (isNaN(largo)) {
    mostrarError(largoError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(largoError);

  if (radio >= largo) {
    mostrarError(radioError, "El radio debe ser menor que el largo.");
    return;
  }

  const angulo = (Math.acos(radio / largo) * 180) / Math.PI;
  document.getElementById("resultado").textContent = angulo.toFixed(2) + " °";
}

// Función para calcular la capacidad de maniobra según su ángulo
function calcularCapacidadManiobra() {
  const capacidadInput = document.getElementById("capacidad");
  const anguloInput = document.getElementById("angulo");
  const cantidadInput = document.getElementById("cantidad");

  const capacidadError = document.getElementById("capacidadError");
  const anguloError = document.getElementById("anguloError");
  const cantidadError = document.getElementById("cantidadError");

  const capacidad = parseFloat(capacidadInput.value);
  const angulo = parseFloat(anguloInput.value);
  const cantidadRamal = parseFloat(cantidadInput.value);

  if (isNaN(capacidad)) {
    mostrarError(capacidadError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(capacidadError);

  if (isNaN(angulo)) {
    mostrarError(anguloError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(anguloError);

  if (isNaN(cantidadRamal)) {
    mostrarError(cantidadError, "Por favor, ingresa un valor numérico válido.");
    return;
  }
  ocultarError(cantidadError);

  const sinAngulo = Math.sin((angulo * Math.PI) / 180);
  const capacidadManiobra = capacidad * cantidadRamal * sinAngulo;

  document.getElementById("capacidadManiobra").innerHTML = `${capacidadManiobra.toFixed(1)} kg`;

  mostrarProceso(capacidad, angulo, cantidadRamal, capacidadManiobra);
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(capacidad, angulo, cantidadRamal, capacidadManiobra) {
  const procesoDiv = document.getElementById("procesoManiobra");
  const imagenProceso = document.getElementById("imagenProceso");
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
      <h3>Proceso y Fórmulas:</h3>
      <p class="formula">Fórmula = Capacidad * Cantidad Ramales * Sen(Ángulo)</p>
      <p class="formula">= ${capacidad} * ${cantidadRamal} * ${Math.sin((angulo * Math.PI) / 180).toFixed(2)}</p>
      <p class="formula">Capacidad ≈ ${capacidadManiobra.toFixed(2)} Kg</p>
    `;
    
  }
  document.getElementById("imagenProceso").style.display = "block";
  
}
