document.addEventListener("DOMContentLoaded", () => {
  // Asociamos los eventos de validación a cada campo
  const campos = [
    { id: "radio", errorId: "radioError" },
    { id: "largo", errorId: "largoError" },
    { id: "valor", errorId: "valorError" },
    { id: "diametro", errorId: "diametroError" },
    { id: "largo1", errorId: "largo1Error" },
    { id: "radio1", errorId: "radio1Error" },
    { id: "capacidad", errorId: "capacidadError" },
    { id: "angulo", errorId: "anguloError" }
  ];

  campos.forEach(campo => {
    const input = document.getElementById(campo.id);
    const errorElemento = document.getElementById(campo.errorId);
    input.addEventListener("input", () => validarCampo(input, errorElemento));
    input.addEventListener("blur", () => validarCampo(input, errorElemento));
  });
});

//Validamos los campos
function validarCampo(input, errorElemento) {
  if (input.value.trim() === "" || isNaN(input.value)) {
    mostrarError(errorElemento, "Por favor, ingresa un valor numérico válido.");
    return false;
  } else {
    ocultarError(errorElemento);
    return true;
  }
}

//Realizamos el calculo
function calcularAngulo() {
  let radio = parseFloat(document.getElementById("radio").value);
  let largo = parseFloat(document.getElementById("largo").value);

  if (!validarCampo(document.getElementById("radio"), document.getElementById("radioError")) ||
      !validarCampo(document.getElementById("largo"), document.getElementById("largoError"))) {
    return;
  }

  if (radio >= largo) {
    mostrarError(document.getElementById("radioError"), "El radio debe ser menor que el largo.");
    return;
  }

  ocultarError(document.getElementById("radioError"));
  ocultarError(document.getElementById("largoError"));

  const anguloRadianes = Math.acos(radio / largo);
  const anguloGrados = (anguloRadianes * 180) / Math.PI;

  document.getElementById("resultadoAngulo").textContent = anguloGrados.toFixed(2) + " °";
}

//Funcion para calcular unidades
function convertirUnidades() {
  const valor = parseFloat(document.getElementById("valor").value);
  const unidadesOrigen = document.getElementById("unidadesOrigen").value;
  const unidadesDestino = document.getElementById("unidadesDestino").value;
  const resultadoInput = document.getElementById("resultado");

  if (!validarCampo(document.getElementById("valor"), document.getElementById("valorError"))) {
    return;
  }

  let resultado = 0;

  const conversiones = {
    "milimetros": { "metros": 0.001, "centimetros": 0.1, "pulgadas": 0.03937 },
    "centimetros": { "metros": 0.01, "milimetros": 10, "pulgadas": 0.3937 },
    "metros": { "milimetros": 1000, "centimetros": 100, "pulgadas": 39.37 },
    "pulgadas": { "metros": 0.0254, "milimetros": 25.4 },
    "pies": { "metros": 0.3048 },
    "libras": { "kilogramos": 0.453592, "toneladas": 0.000453592 },
    "kilogramos": { "libras": 2.20462, "toneladas": 0.001 }
  };

  resultado = valor * (conversiones[unidadesOrigen]?.[unidadesDestino] || 0);

  resultadoInput.value = `${resultado.toFixed(2)} ${unidadesDestino}`;
}

function calculoTensionAhorcadoDoble() {
  //Obtenemos los datos ingresados
  let diametroPerimetro = parseFloat(document.getElementById("diametro").value);
  let largoManiobra = parseFloat(document.getElementById("largo1").value);
  let radioManiobra = parseFloat(document.getElementById("radio1").value);
  let capacidadManiobra = parseFloat(document.getElementById("capacidad").value);
  let anguloManiobra = parseFloat(document.getElementById("angulo").value);

  //Validamos los campos
  if (!validarCampo(document.getElementById("diametro"), document.getElementById("diametroError")) ||
      !validarCampo(document.getElementById("largo1"), document.getElementById("largo1Error")) ||
      !validarCampo(document.getElementById("radio1"), document.getElementById("radio1Error")) ||
      !validarCampo(document.getElementById("capacidad"), document.getElementById("capacidadError")) ||
      !validarCampo(document.getElementById("angulo"), document.getElementById("anguloError"))) {
    return;
  }

  //1. Perímetro del elemento (tubo/cañería) = pérdida de largo por la vuelta
  const calculoPerimetro = diametroPerimetro * Math.PI;

  //2. Largo real de la eslinga = Largo de maniobra - Perímetro (Manual pág. 69)
  const largoReal = largoManiobra - calculoPerimetro;

  if (largoReal <= 0) {
    mostrarError(
      document.getElementById("largo1Error"),
      "El largo de la maniobra es menor o igual al perímetro del elemento. Revisa los datos."
    );
    return;
  }

  if (radioManiobra >= largoReal) {
    mostrarError(
      document.getElementById("radio1Error"),
      "El radio debe ser menor que el largo real de la eslinga (largo - perímetro)."
    );
    return;
  }

  ocultarError(document.getElementById("largo1Error"));
  ocultarError(document.getElementById("radio1Error"));

  //Aviso (no bloqueante): el factor 75% solo es válido con ángulo de
  //estrangulación entre 120° y 180° (Manual pág. 70)
  const anguloErrorEl = document.getElementById("anguloError");
  if (anguloManiobra < 120 || anguloManiobra > 180) {
    anguloErrorEl.style.color = "orange";
    anguloErrorEl.textContent =
      "Atención: el factor de 75% solo es válido para ángulos de estrangulación entre 120° y 180°. Verifica la maniobra.";
  } else {
    ocultarError(anguloErrorEl);
  }

  //3. Ángulo de maniobra = Cos⁻¹(Radio / Largo REAL) (Manual pág. 22)
  const anguloRadianes = Math.acos(radioManiobra / largoReal);
  const anguloManiobraDoble = (anguloRadianes * 180) / Math.PI;

  //4. Capacidad de la PAREJA (doble ramal) = 2 x Capacidad eslinga x sen(ángulo) (Manual pág. 23 y 70)
  const capacidadBruta = 2 * capacidadManiobra * Math.sin(anguloRadianes);

  //5. Capacidad real ahorcada = Capacidad bruta x 75% (Manual pág. 70)
  const capacidadReal = (capacidadBruta * 75) / 100;

  document.getElementById("capacidadBrutaAhorcadoDoble").innerHTML =
    capacidadBruta.toFixed(2) + " Kg";

  document.getElementById("capacidadRealAhorcadoDoble").innerHTML =
    capacidadReal.toFixed(2) + " Kg";

  mostrarProceso(
    diametroPerimetro,
    calculoPerimetro,
    largoReal,
    anguloManiobraDoble,
    capacidadBruta,
    capacidadReal
  );
}

// Función para mostrar el proceso y fórmulas utilizadas
function mostrarProceso(
  diametroPerimetro,
  calculoPerimetro,
  largoReal,
  anguloManiobraDoble,
  capacidadBruta,
  capacidadReal) {
  const procesoDiv = document.getElementById("procesoAhorcado");

  // Detectar el idioma de la página
  const lang = document.documentElement.lang;

  if (lang === "es") {
    // Texto en español
    procesoDiv.innerHTML = `
    <h3>Proceso y Formulas:</h3>
    <p>1. Obtenemos los valores de diámetro, largo, radio, capacidad, ángulo.</p>
    <p>2. Calculamos el perímetro del elemento (cañería o tubo), que representa la pérdida de largo por la vuelta:</p>
    <p class="formula">Perímetro = Diámetro * π</p>
    <p class="formula"> = ${diametroPerimetro} * ${Math.PI.toFixed(2)}</p>
    <p class="formula">Perímetro ≈ ${calculoPerimetro.toFixed(2)} m (Pérdida por la vuelta)</p>
    <p>3. Calculamos el largo real de la eslinga:</p>
    <p class="formula">Largo Real = Largo de Maniobra - Perímetro</p>
    <p class="formula"> ≈ ${largoReal.toFixed(2)} m</p>
    <p>4. Calculamos el ángulo de maniobra usando el largo REAL:</p>
    <p class="formula">Ángulo = Cos<sup>-1</sup>(Radio ÷ Largo Real)</p>
    <p class="formula"> ≈ ${anguloManiobraDoble.toFixed(2)}°</p>
    <p>5. Calculamos la capacidad bruta de la pareja (doble ramal):</p>
    <p class="formula">Capacidad Bruta = 2 * Capacidad * Seno(Ángulo)</p>
    <p class="formula"> ≈ ${capacidadBruta.toFixed(2)}</p>
    <p>6. Calculamos la capacidad real (factor de seguridad ahorcado del 75%, válido para ángulo de estrangulación entre 120° y 180°):</p>
    <p class="formula">Capacidad Real = Capacidad Bruta * 75%</p>
    <p class="formula"> ≈ ${capacidadReal.toFixed(2)} Kg</p>
    `;
  }

  // Mostrar el div de la imagen
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  imagenProcesoDiv.style.display = "block";
}

// Función para ocultar el div de la imagen
function ocultarImagen() {
  const imagenProcesoDiv = document.getElementById("imagenProceso");
  imagenProcesoDiv.style.display = "none";
}

// Función para mostrar mensajes de error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.color = "red";
}

// Función para ocultar mensajes de error
function ocultarError(elemento) {
  elemento.textContent = "";
  elemento.style.color = "initial";
}
