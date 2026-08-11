// presionApoyo.js
//
// Calculadora de presion de apoyo de patas estabilizadoras (ground
// bearing pressure). Formula base:
//
//   presion (kg/cm2) = carga en la pata (kg) / area de apoyo (cm2)
//
// Se compara esa presion contra la capacidad portante del terreno
// (elegida de una tabla de referencia orientativa, o ingresada a mano
// si el usuario tiene el dato real de un estudio de suelo). Si la
// presion calculada excede la capacidad del terreno, se calcula ademas
// el area minima que haria falta para quedar dentro del limite.

(function () {
  const elForma = document.getElementById("paForma");
  const elDimsCuadrado = document.getElementById("paDimsCuadrado");
  const elDimsRectangular = document.getElementById("paDimsRectangular");
  const elDimsRedondo = document.getElementById("paDimsRedondo");

  const elCarga = document.getElementById("paCarga");
  const elLado = document.getElementById("paLado");
  const elLargo = document.getElementById("paLargo");
  const elAncho = document.getElementById("paAncho");
  const elDiametro = document.getElementById("paDiametro");
  const elTerreno = document.getElementById("paTerreno");
  const elCapacidadManual = document.getElementById("paCapacidadManual");

  const elBtnCalcular = document.getElementById("paBtnCalcular");
  const elResultado = document.getElementById("paResultado");
  const elTextoPresion = document.getElementById("paTextoPresion");
  const elTextoCapacidad = document.getElementById("paTextoCapacidad");
  const elTextoEstado = document.getElementById("paTextoEstado");
  const elTextoAreaMinima = document.getElementById("paTextoAreaMinima");

  // --- Mostrar/ocultar los campos de dimensiones segun la forma elegida ---
  function actualizarCamposDeForma() {
    const forma = elForma.value;
    elDimsCuadrado.style.display = forma === "cuadrado" ? "block" : "none";
    elDimsRectangular.style.display = forma === "rectangular" ? "block" : "none";
    elDimsRedondo.style.display = forma === "redondo" ? "block" : "none";
  }
  elForma.addEventListener("change", actualizarCamposDeForma);
  actualizarCamposDeForma();

  // Las opciones "2.04b" y "3.06b" del select son distintas etiquetas
  // (asfalto / hormigon) con el mismo valor numerico que otra opcion --
  // se limpia el sufijo "b" al leer el numero real.
  function valorNumericoDeTerreno(valorSelect) {
    const limpio = valorSelect.replace("b", "");
    return parseFloat(limpio);
  }

  function calcularAreaCm2() {
    const forma = elForma.value;

    if (forma === "cuadrado") {
      const lado = parseFloat(elLado.value);
      if (!lado || lado <= 0) return null;
      return lado * lado;
    }

    if (forma === "rectangular") {
      const largo = parseFloat(elLargo.value);
      const ancho = parseFloat(elAncho.value);
      if (!largo || !ancho || largo <= 0 || ancho <= 0) return null;
      return largo * ancho;
    }

    if (forma === "redondo") {
      const diametro = parseFloat(elDiametro.value);
      if (!diametro || diametro <= 0) return null;
      const radio = diametro / 2;
      return Math.PI * radio * radio;
    }

    return null;
  }

  function obtenerCapacidadTerreno() {
    // Prioridad: si el usuario ingreso un valor manual, se usa ese
    // (es un dato real de estudio de suelo, mas confiable que la tabla
    // orientativa).
    const manual = parseFloat(elCapacidadManual.value);
    if (manual && manual > 0) {
      return { valor: manual, esManual: true };
    }

    const seleccion = elTerreno.value;
    if (!seleccion || seleccion === "0") return null;

    return { valor: valorNumericoDeTerreno(seleccion), esManual: false };
  }

  function calcular() {
    const carga = parseFloat(elCarga.value);
    if (!carga || carga <= 0) {
      alert("Ingresa la carga en la pata estabilizadora.");
      return;
    }

    const areaCm2 = calcularAreaCm2();
    if (!areaCm2) {
      alert("Ingresa las dimensiones del plato/madera de apoyo.");
      return;
    }

    const capacidad = obtenerCapacidadTerreno();
    if (!capacidad) {
      alert(
        "Selecciona un tipo de terreno de la lista, o ingresa la capacidad " +
          "portante real si la tienes."
      );
      return;
    }

    const presion = carga / areaCm2;
    const excede = presion > capacidad.valor;

    elTextoPresion.textContent = "Presión de apoyo: " + presion.toFixed(2) + " kg/cm²";
    elTextoCapacidad.textContent =
      "Capacidad del terreno" +
      (capacidad.esManual ? " (valor ingresado)" : " (valor orientativo)") +
      ": " +
      capacidad.valor.toFixed(2) +
      " kg/cm²";

    elResultado.className = "pa-resultado " + (excede ? "excede" : "ok");
    elResultado.style.display = "block";

    if (excede) {
      const areaMinimaCm2 = carga / capacidad.valor;
      elTextoEstado.textContent =
        "⚠ La presión calculada EXCEDE la capacidad del terreno.";

      let textoAreaMinima = "Área mínima necesaria: " + areaMinimaCm2.toFixed(0) + " cm²";
      if (elForma.value === "cuadrado") {
        const ladoMinimo = Math.sqrt(areaMinimaCm2);
        textoAreaMinima += " (lado mínimo aprox. " + ladoMinimo.toFixed(0) + " cm)";
      } else if (elForma.value === "redondo") {
        const diametroMinimo = 2 * Math.sqrt(areaMinimaCm2 / Math.PI);
        textoAreaMinima += " (diámetro mínimo aprox. " + diametroMinimo.toFixed(0) + " cm)";
      }
      elTextoAreaMinima.textContent = textoAreaMinima;
    } else {
      elTextoEstado.textContent = "✓ La presión calculada está dentro de la capacidad del terreno.";
      elTextoAreaMinima.textContent = "";
    }
  }

  elBtnCalcular.addEventListener("click", calcular);
})();
