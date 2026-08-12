// limiteViento.js
//
// Compara el viento actual/pronosticado contra el limite maximo del
// fabricante de la grua. Para cargas de "superficie amplia" (paneles,
// lonas, planchas grandes) se usa un umbral de precaucion mas
// conservador, porque esas cargas actuan como vela y son mas sensibles
// al viento que una carga compacta del mismo peso.

(function () {
  const elVientoActual = document.getElementById("vtVientoActual");
  const elLimiteFabricante = document.getElementById("vtLimiteFabricante");
  const elTipoCarga = document.getElementById("vtTipoCarga");
  const elBtnCalcular = document.getElementById("vtBtnCalcular");
  const elResultado = document.getElementById("vtResultado");

  function calcular() {
    const viento = parseFloat(elVientoActual.value);
    const limite = parseFloat(elLimiteFabricante.value);
    const tipoCarga = elTipoCarga.value;

    if (!viento || viento < 0) {
      alert("Ingresa la velocidad de viento actual.");
      return;
    }
    if (!limite || limite <= 0) {
      alert("Ingresa el límite máximo de viento del fabricante.");
      return;
    }

    // Umbral de precaucion: para carga compacta, avisar desde el 80% del
    // limite. Para carga de superficie amplia, avisar antes (70%), ya
    // que el viento real percibido en altura suele ser mayor.
    const factorPrecaucion = tipoCarga === "amplia" ? 0.7 : 0.8;
    const umbralPrecaucion = limite * factorPrecaucion;

    elResultado.style.display = "block";

    if (viento >= limite) {
      elResultado.className = "vt-resultado no-izar";
      elResultado.textContent =
        "⛔ NO IZAR — el viento (" + viento + " km/h) alcanza o excede el límite del fabricante (" + limite + " km/h).";
    } else if (viento >= umbralPrecaucion) {
      elResultado.className = "vt-resultado precaucion";
      elResultado.textContent =
        "⚠ PRECAUCIÓN — el viento (" + viento + " km/h) está cerca del límite (" + limite + " km/h)" +
        (tipoCarga === "amplia" ? ", y la carga tiene superficie amplia. Evalúa con el supervisor." : ". Monitorea antes de izar.");
    } else {
      elResultado.className = "vt-resultado ok";
      elResultado.textContent =
        "✓ Dentro de rango seguro — viento " + viento + " km/h, límite " + limite + " km/h.";
    }
  }

  elBtnCalcular.addEventListener("click", calcular);
})();
