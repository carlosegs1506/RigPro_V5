// densidadMateriales.js
//
// Calcula el peso estimado de una pieza a partir de sus dimensiones y
// la densidad del material seleccionado:
//
//   peso (kg) = volumen (m3) x densidad (kg/m3)
//
// Las dimensiones se ingresan en centimetros (mas comodo para piezas
// tipicas de rigging) y se convierten a metros cubicos internamente.

(function () {
  const elMaterial = document.getElementById("densMaterial");
  const elLargo = document.getElementById("densLargo");
  const elAncho = document.getElementById("densAncho");
  const elAlto = document.getElementById("densAlto");
  const elBtnCalcular = document.getElementById("densBtnCalcular");
  const elResultado = document.getElementById("densResultado");
  const elVolumen = document.getElementById("densVolumen");
  const elPeso = document.getElementById("densPeso");

  function calcular() {
    const densidad = parseFloat(elMaterial.value);
    const largoCm = parseFloat(elLargo.value);
    const anchoCm = parseFloat(elAncho.value);
    const altoCm = parseFloat(elAlto.value);

    if (!largoCm || !anchoCm || !altoCm || largoCm <= 0 || anchoCm <= 0 || altoCm <= 0) {
      alert("Ingresa largo, ancho y alto/espesor de la pieza.");
      return;
    }

    // cm -> m
    const largoM = largoCm / 100;
    const anchoM = anchoCm / 100;
    const altoM = altoCm / 100;

    const volumenM3 = largoM * anchoM * altoM;
    const pesoKg = volumenM3 * densidad;

    elResultado.style.display = "block";
    elVolumen.textContent = volumenM3.toFixed(4) + " m³";
    elPeso.textContent = pesoKg.toFixed(1) + " kg";
  }

  elBtnCalcular.addEventListener("click", calcular);
})();
