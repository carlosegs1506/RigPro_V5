// ticketIzaje.js
//
// Registro digital de tickets diarios de izaje, guardado local en el
// dispositivo (localStorage). Cada ticket documenta una maniobra:
// fecha, proyecto, responsable, grua, peso, descripcion y notas.

(function () {
  const CLAVE_TICKETS = "rigpro_tickets_izaje";

  const elFecha = document.getElementById("tkFecha");
  const elProyecto = document.getElementById("tkProyecto");
  const elResponsable = document.getElementById("tkResponsable");
  const elGrua = document.getElementById("tkGrua");
  const elPeso = document.getElementById("tkPeso");
  const elDescripcion = document.getElementById("tkDescripcion");
  const elNotas = document.getElementById("tkNotas");

  const elBtnAgregar = document.getElementById("tkBtnAgregar");
  const elLista = document.getElementById("tkLista");
  const elBtnBorrarTodo = document.getElementById("tkBtnBorrarTodo");

  function leerTickets() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_TICKETS)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarTickets(tickets) {
    localStorage.setItem(CLAVE_TICKETS, JSON.stringify(tickets));
  }

  function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    return new Date(fechaISO + "T00:00:00").toLocaleDateString("es-CL");
  }

  function agregarTicket() {
    const fecha = elFecha.value;
    const proyecto = elProyecto.value.trim();
    const responsable = elResponsable.value.trim();
    const grua = elGrua.value.trim();
    const peso = elPeso.value;
    const descripcion = elDescripcion.value.trim();
    const notas = elNotas.value.trim();

    if (!fecha) {
      alert("Ingresa la fecha.");
      return;
    }
    if (!proyecto) {
      alert("Ingresa el proyecto/cliente/ubicación.");
      return;
    }
    if (!descripcion) {
      alert("Ingresa una descripción breve de la maniobra.");
      return;
    }

    const tickets = leerTickets();
    tickets.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      fecha,
      proyecto,
      responsable,
      grua,
      peso,
      descripcion,
      notas,
    });
    guardarTickets(tickets);

    elProyecto.value = "";
    elResponsable.value = "";
    elGrua.value = "";
    elPeso.value = "";
    elDescripcion.value = "";
    elNotas.value = "";

    renderizarLista();
  }

  function borrarTicket(id) {
    let tickets = leerTickets();
    tickets = tickets.filter((t) => t.id !== id);
    guardarTickets(tickets);
    renderizarLista();
  }

  function borrarTodosLosTickets() {
    localStorage.removeItem(CLAVE_TICKETS);
    renderizarLista();
  }

  function renderizarLista() {
    const tickets = leerTickets();
    elLista.innerHTML = "";

    if (tickets.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "tk-vacio";
      vacio.textContent = "Todavía no has guardado ningún ticket.";
      elLista.appendChild(vacio);
      elBtnBorrarTodo.style.display = "none";
      return;
    }

    elBtnBorrarTodo.style.display = "block";

    tickets.forEach((ticket) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tk-tarjeta";

      const titulo = document.createElement("div");
      titulo.className = "tk-tarjeta-titulo";

      const spanTitulo = document.createElement("span");
      spanTitulo.textContent = formatearFecha(ticket.fecha) + " — " + ticket.proyecto;

      const btnBorrar = document.createElement("button");
      btnBorrar.className = "tk-btn-borrar";
      btnBorrar.textContent = "Borrar";
      btnBorrar.addEventListener("click", () => {
        if (confirm("¿Borrar este ticket?")) borrarTicket(ticket.id);
      });

      titulo.appendChild(spanTitulo);
      titulo.appendChild(btnBorrar);

      const detalle = document.createElement("div");
      detalle.className = "tk-tarjeta-detalle";
      detalle.innerHTML =
        (ticket.responsable ? "Responsable: " + escapeHtml(ticket.responsable) + "<br>" : "") +
        (ticket.grua ? "Grúa: " + escapeHtml(ticket.grua) + "<br>" : "") +
        (ticket.peso ? "Peso: " + escapeHtml(String(ticket.peso)) + " kg<br>" : "") +
        "Descripción: " + escapeHtml(ticket.descripcion) +
        (ticket.notas ? "<br>Notas: " + escapeHtml(ticket.notas) : "");

      tarjeta.appendChild(titulo);
      tarjeta.appendChild(detalle);
      elLista.appendChild(tarjeta);
    });
  }

  // Escapar HTML basico para evitar que texto ingresado por el usuario
  // se interprete como markup al insertarlo con innerHTML.
  function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  elBtnAgregar.addEventListener("click", agregarTicket);
  elBtnBorrarTodo.addEventListener("click", () => {
    if (confirm("¿Borrar TODOS los tickets guardados? No se puede deshacer.")) {
      borrarTodosLosTickets();
    }
  });

  renderizarLista();
})();
