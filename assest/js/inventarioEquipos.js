// inventarioEquipos.js
//
// Inventario de equipos de izaje (eslingas, cadenas, grilletes, etc.)
// con seguimiento de fechas de inspeccion, guardado local en el
// dispositivo (localStorage) -- reemplaza el control en papel/etiquetas.
//
// Cada equipo tiene una fecha de ultima inspeccion y una frecuencia
// (en meses). La proxima inspeccion = ultima inspeccion + frecuencia.
// Estado segun cuanto falta para esa fecha:
//   - "vencida": ya paso la fecha de proxima inspeccion
//   - "proxima": faltan 30 dias o menos
//   - "ok": falta mas de 30 dias

(function () {
  const CLAVE_INVENTARIO = "rigpro_inventario_equipos";
  const DIAS_AVISO_PROXIMA = 30;

  const elNombre = document.getElementById("invNombre");
  const elTipo = document.getElementById("invTipo");
  const elWll = document.getElementById("invWll");
  const elUltimaInspeccion = document.getElementById("invUltimaInspeccion");
  const elIntervalo = document.getElementById("invIntervalo");
  const elNotas = document.getElementById("invNotas");

  const elBtnAgregar = document.getElementById("invBtnAgregar");
  const elLista = document.getElementById("invLista");
  const elBtnBorrarTodo = document.getElementById("invBtnBorrarTodo");

  function leerInventario() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_INVENTARIO)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarInventario(inventario) {
    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(inventario));
  }

  function calcularProximaInspeccion(fechaUltimaInspeccionISO, intervaloMeses) {
    const fecha = new Date(fechaUltimaInspeccionISO + "T00:00:00");
    fecha.setMonth(fecha.getMonth() + parseInt(intervaloMeses, 10));
    return fecha;
  }

  function calcularEstado(fechaProximaInspeccion) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diffMs = fechaProximaInspeccion.getTime() - hoy.getTime();
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return { clase: "vencida", texto: "⚠ Inspección VENCIDA hace " + Math.abs(diffDias) + " día(s)" };
    if (diffDias <= DIAS_AVISO_PROXIMA) return { clase: "proxima", texto: "Vence en " + diffDias + " día(s)" };
    return { clase: "ok", texto: "OK — vence en " + diffDias + " día(s)" };
  }

  function formatearFecha(fecha) {
    return fecha.toLocaleDateString("es-CL");
  }

  function agregarEquipo() {
    const nombre = elNombre.value.trim();
    const tipo = elTipo.value;
    const wll = parseFloat(elWll.value);
    const ultimaInspeccion = elUltimaInspeccion.value;
    const intervaloMeses = elIntervalo.value;
    const notas = elNotas.value.trim();

    if (!nombre) {
      alert("Ingresa un nombre o identificador para el equipo.");
      return;
    }
    if (!wll || wll <= 0) {
      alert("Ingresa la capacidad (WLL) del equipo.");
      return;
    }
    if (!ultimaInspeccion) {
      alert("Ingresa la fecha de la última inspección.");
      return;
    }

    const inventario = leerInventario();
    inventario.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      nombre,
      tipo,
      wll,
      ultimaInspeccion,
      intervaloMeses,
      notas,
    });
    guardarInventario(inventario);

    elNombre.value = "";
    elWll.value = "";
    elUltimaInspeccion.value = "";
    elNotas.value = "";

    renderizarLista();
  }

  function marcarInspeccionadoHoy(id) {
    const inventario = leerInventario();
    const equipo = inventario.find((e) => e.id === id);
    if (!equipo) return;

    const hoyISO = new Date().toISOString().slice(0, 10);
    equipo.ultimaInspeccion = hoyISO;

    guardarInventario(inventario);
    renderizarLista();
  }

  function borrarEquipo(id) {
    let inventario = leerInventario();
    inventario = inventario.filter((e) => e.id !== id);
    guardarInventario(inventario);
    renderizarLista();
  }

  function borrarTodoElInventario() {
    localStorage.removeItem(CLAVE_INVENTARIO);
    renderizarLista();
  }

  function renderizarLista() {
    const inventario = leerInventario();

    elLista.innerHTML = "";

    if (inventario.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "inv-vacio";
      vacio.textContent = "Todavía no has agregado ningún equipo.";
      elLista.appendChild(vacio);
      elBtnBorrarTodo.style.display = "none";
      return;
    }

    elBtnBorrarTodo.style.display = "block";

    // Ordenar: los mas urgentes (vencidos primero, luego proximos, luego ok)
    // arriba de la lista.
    const prioridad = { vencida: 0, proxima: 1, ok: 2 };
    const inventarioConEstado = inventario.map((equipo) => {
      const proxima = calcularProximaInspeccion(equipo.ultimaInspeccion, equipo.intervaloMeses);
      const estado = calcularEstado(proxima);
      return { equipo, proxima, estado };
    });
    inventarioConEstado.sort((a, b) => prioridad[a.estado.clase] - prioridad[b.estado.clase]);

    inventarioConEstado.forEach(({ equipo, proxima, estado }) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "inv-tarjeta " + estado.clase;

      const titulo = document.createElement("div");
      titulo.className = "inv-tarjeta-titulo";
      titulo.textContent = equipo.nombre;

      const detalle = document.createElement("div");
      detalle.className = "inv-tarjeta-detalle";
      detalle.textContent =
        equipo.tipo +
        " · WLL " +
        equipo.wll +
        " kg · Última inspección: " +
        formatearFecha(new Date(equipo.ultimaInspeccion + "T00:00:00")) +
        " · Próxima: " +
        formatearFecha(proxima) +
        (equipo.notas ? " · " + equipo.notas : "");

      const estadoTexto = document.createElement("div");
      estadoTexto.className = "inv-tarjeta-estado";
      estadoTexto.textContent = estado.texto;

      const botones = document.createElement("div");
      botones.className = "inv-tarjeta-botones";

      const btnInspeccionado = document.createElement("button");
      btnInspeccionado.className = "inv-btn-inspeccionado";
      btnInspeccionado.textContent = "Marcar inspeccionado hoy";
      btnInspeccionado.addEventListener("click", () => marcarInspeccionadoHoy(equipo.id));

      const btnBorrar = document.createElement("button");
      btnBorrar.className = "inv-btn-borrar";
      btnBorrar.textContent = "Borrar";
      btnBorrar.addEventListener("click", () => {
        if (confirm("¿Borrar \"" + equipo.nombre + "\" del inventario?")) {
          borrarEquipo(equipo.id);
        }
      });

      botones.appendChild(btnInspeccionado);
      botones.appendChild(btnBorrar);

      tarjeta.appendChild(titulo);
      tarjeta.appendChild(detalle);
      tarjeta.appendChild(estadoTexto);
      tarjeta.appendChild(botones);

      elLista.appendChild(tarjeta);
    });
  }

  elBtnAgregar.addEventListener("click", agregarEquipo);
  elBtnBorrarTodo.addEventListener("click", () => {
    if (confirm("¿Borrar TODO el inventario de equipos? No se puede deshacer.")) {
      borrarTodoElInventario();
    }
  });

  renderizarLista();
})();
