// bibliotecaGruas.js
//
// Biblioteca personal de grúas. Cada grúa guarda su modelo y una lista
// de "puntos de capacidad conocidos" -- combinaciones reales de pluma,
// contrapeso y radio de trabajo con su capacidad maxima, que el propio
// operador ingresa leyendo su tabla de carga oficial. No se trata de
// cargar la tabla completa, solo los puntos que realmente usa.
//
// Todo se guarda en localStorage, 100% local en el dispositivo -- esta
// es la pieza base que despues usara el Generador de Plan de Izaje para
// buscar el punto guardado mas cercano a los parametros de cada
// maniobra.

(function () {
  const CLAVE_GRUAS = "rigpro_biblioteca_gruas";

  let grUaSeleccionadaId = null;

  const elModelo = document.getElementById("bgModelo");
  const elFabricante = document.getElementById("bgFabricante");
  const elBtnAgregarGrua = document.getElementById("bgBtnAgregarGrua");
  const elListaGruas = document.getElementById("bgListaGruas");

  const elDetalleGrua = document.getElementById("bgDetalleGrua");
  const elTituloDetalle = document.getElementById("bgTituloDetalle");
  const elTablaPuntosBody = document.getElementById("bgTablaPuntosBody");

  const elPluma = document.getElementById("bgPluma");
  const elContrapeso = document.getElementById("bgContrapeso");
  const elRadio = document.getElementById("bgRadio");
  const elCapacidad = document.getElementById("bgCapacidad");
  const elBtnAgregarPunto = document.getElementById("bgBtnAgregarPunto");
  const elBtnGenerarPlan = document.getElementById("bgBtnGenerarPlan");
  const elBtnBorrarGrua = document.getElementById("bgBtnBorrarGrua");

  function leerGruas() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_GRUAS)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarGruas(gruas) {
    localStorage.setItem(CLAVE_GRUAS, JSON.stringify(gruas));
  }

  function agregarGrua() {
    const modelo = elModelo.value.trim();
    const fabricante = elFabricante.value.trim();

    if (!modelo) {
      alert("Ingresa el modelo de la grúa.");
      return;
    }

    const gruas = leerGruas();
    const nuevaGrua = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      modelo,
      fabricante,
      puntos: [],
    };
    gruas.unshift(nuevaGrua);
    guardarGruas(gruas);

    elModelo.value = "";
    elFabricante.value = "";

    grUaSeleccionadaId = nuevaGrua.id;
    renderizarListaGruas();
    renderizarDetalleGrua();
  }

  function borrarGrua(id) {
    let gruas = leerGruas();
    gruas = gruas.filter((g) => g.id !== id);
    guardarGruas(gruas);

    if (grUaSeleccionadaId === id) {
      grUaSeleccionadaId = null;
    }
    renderizarListaGruas();
    renderizarDetalleGrua();
  }

  function seleccionarGrua(id) {
    grUaSeleccionadaId = id;
    renderizarListaGruas();
    renderizarDetalleGrua();
  }

  function agregarPunto() {
    if (!grUaSeleccionadaId) return;

    const pluma = parseFloat(elPluma.value);
    const contrapeso = elContrapeso.value.trim();
    const radio = parseFloat(elRadio.value);
    const capacidad = parseFloat(elCapacidad.value);

    if (!pluma || pluma <= 0) {
      alert("Ingresa el largo de pluma.");
      return;
    }
    if (!radio || radio <= 0) {
      alert("Ingresa el radio de trabajo.");
      return;
    }
    if (!capacidad || capacidad <= 0) {
      alert("Ingresa la capacidad máxima para ese punto.");
      return;
    }

    const gruas = leerGruas();
    const grua = gruas.find((g) => g.id === grUaSeleccionadaId);
    if (!grua) return;

    grua.puntos.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      pluma,
      contrapeso,
      radio,
      capacidad,
    });
    // Ordenar los puntos por radio, para que la tabla y la futura
    // busqueda del "mas cercano" sean mas faciles de leer.
    grua.puntos.sort((a, b) => a.radio - b.radio);

    guardarGruas(gruas);

    elPluma.value = "";
    elContrapeso.value = "";
    elRadio.value = "";
    elCapacidad.value = "";

    renderizarListaGruas();
    renderizarDetalleGrua();
  }

  function borrarPunto(idPunto) {
    const gruas = leerGruas();
    const grua = gruas.find((g) => g.id === grUaSeleccionadaId);
    if (!grua) return;

    grua.puntos = grua.puntos.filter((p) => p.id !== idPunto);
    guardarGruas(gruas);

    renderizarListaGruas();
    renderizarDetalleGrua();
  }

  function renderizarListaGruas() {
    const gruas = leerGruas();
    elListaGruas.innerHTML = "";

    if (gruas.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "bg-vacio";
      vacio.textContent = "Todavía no has agregado ninguna grúa.";
      elListaGruas.appendChild(vacio);
      return;
    }

    gruas.forEach((grua) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "bg-tarjeta-grua" + (grua.id === grUaSeleccionadaId ? " activa" : "");
      tarjeta.addEventListener("click", () => seleccionarGrua(grua.id));

      const titulo = document.createElement("div");
      titulo.className = "bg-tarjeta-grua-titulo";
      titulo.innerHTML = `<span>${escapeHtml(grua.modelo)}</span>`;

      const sub = document.createElement("div");
      sub.className = "bg-tarjeta-grua-sub";
      sub.textContent =
        (grua.fabricante ? grua.fabricante + " · " : "") +
        grua.puntos.length + " punto(s) guardado(s)";

      tarjeta.appendChild(titulo);
      tarjeta.appendChild(sub);
      elListaGruas.appendChild(tarjeta);
    });
  }

  function renderizarDetalleGrua() {
    if (!grUaSeleccionadaId) {
      elDetalleGrua.style.display = "none";
      return;
    }

    const gruas = leerGruas();
    const grua = gruas.find((g) => g.id === grUaSeleccionadaId);
    if (!grua) {
      elDetalleGrua.style.display = "none";
      return;
    }

    elDetalleGrua.style.display = "block";
    elTituloDetalle.textContent = grua.modelo;

    elTablaPuntosBody.innerHTML = "";

    if (grua.puntos.length === 0) {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td colspan="5" style="opacity:0.7;">Sin puntos guardados aún.</td>`;
      elTablaPuntosBody.appendChild(fila);
    } else {
      grua.puntos.forEach((punto) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${punto.pluma}</td>
          <td>${escapeHtml(punto.contrapeso || "-")}</td>
          <td>${punto.radio}</td>
          <td>${punto.capacidad}</td>
          <td></td>
        `;
        const celdaBoton = fila.lastElementChild;
        const btnBorrar = document.createElement("button");
        btnBorrar.className = "bg-btn-borrar-punto";
        btnBorrar.textContent = "✕";
        btnBorrar.addEventListener("click", (evento) => {
          evento.stopPropagation();
          borrarPunto(punto.id);
        });
        celdaBoton.appendChild(btnBorrar);
        elTablaPuntosBody.appendChild(fila);
      });
    }
  }

  function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  elBtnAgregarGrua.addEventListener("click", agregarGrua);
  elBtnAgregarPunto.addEventListener("click", agregarPunto);
  elBtnGenerarPlan.addEventListener("click", () => {
    if (!grUaSeleccionadaId) return;
    window.location.href = "./planIzaje.html?gruaId=" + encodeURIComponent(grUaSeleccionadaId);
  });
  elBtnBorrarGrua.addEventListener("click", () => {
    if (!grUaSeleccionadaId) return;
    const gruas = leerGruas();
    const grua = gruas.find((g) => g.id === grUaSeleccionadaId);
    if (grua && confirm('¿Borrar la grúa "' + grua.modelo + '" y todos sus puntos guardados?')) {
      borrarGrua(grUaSeleccionadaId);
    }
  });

  renderizarListaGruas();
  renderizarDetalleGrua();
})();
