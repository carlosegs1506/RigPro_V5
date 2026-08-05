// Funcionn para calcular largo, radio, altura
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("trianguloForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener valores del formulario
    const largo = parseFloat(document.getElementById("largo").value);
    const radio = parseFloat(document.getElementById("radio").value);
    const altura = parseFloat(document.getElementById("altura").value);

    // Obtener elementos para mostrar errores
    const errorElements = {
      largo: document.getElementById("largoError"),
      radio: document.getElementById("radioError"),
      altura: document.getElementById("alturaError"),
      general: document.getElementById("generalError")
    };

    // Inicializar variables
    let resultado = "", formula = "";

    // Función para validar valores numéricos
    const validarValores = (...values) => values.filter(v => !isNaN(v)).length;

    // Validar los valores ingresados
    const valoresValidos = validarValores(largo, radio, altura);

    // Mostrar error si no hay valores numéricos o si no hay exactamente dos valores numéricos
    if (valoresValidos === 0 || valoresValidos !== 2) {
      mostrarError(errorElements.general, valoresValidos === 0 ? "Por favor, ingresa al menos dos valores numéricos válidos." : "Por favor, ingresa exactamente dos valores numéricos válidos.");
      return;
    }

    // Ocultar errores previos
    Object.values(errorElements).forEach(ocultarError);

    // Realizar cálculos
    const calcularResultado = (valor1, valor2, calcular, label1, label2, label3) => {
      const calculado = calcular(valor1, valor2);

      resultado = `${label3}: ${calculado.toFixed(2)} mts`;
      formula = `
        1. Obtenemos los valores de ${label1}, ${label2}.<br>
        2. Calculamos ${label3}:<br>
        <p class="formula">
            Fórmula = √(${label1}<sup>2</sup> - ${label2}<sup>2</sup>)<br>
            = √(${valor1}<sup>2</sup> - ${valor2}<sup>2</sup>)<br>
            ≈ ${calculado.toFixed(2)} mts
        </p>
      `;
    };

    if (!isNaN(largo) && !isNaN(radio)) {
      calcularResultado(largo, radio, (l, r) => Math.sqrt(l * l - r * r), "Largo", "Radio", "Altura");
    } else if (!isNaN(largo) && !isNaN(altura)) {
      calcularResultado(largo, altura, (l, a) => Math.sqrt(l * l - a * a), "Largo", "Altura", "Radio");
    } else if (!isNaN(radio) && !isNaN(altura)) {
      calcularResultado(radio, altura, (r, a) => Math.sqrt(r * r + a * a), "Radio", "Altura", "Largo");
    }

    // Mostrar resultado y fórmula
    document.getElementById("resultado").textContent = resultado;
    mostrarProceso(formula);
  });

  function mostrarProceso(formula) {
    document.getElementById("mostrarProceso").innerHTML = `
      <h3>Fórmula y Proceso:</h3>
      <br/>
      <p>${formula}</p>
    `;
  }

  function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.style.color = "red";
  }

  function ocultarError(elemento) {
    elemento.textContent = "";
    elemento.style.color = "initial";
  }
});
