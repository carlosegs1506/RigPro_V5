// planIzaje.js
//
// Generador de Plan de Izaje. Junta:
// - La biblioteca personal de grúas (localStorage "rigpro_biblioteca_gruas"),
//   buscando el punto de capacidad guardado mas cercano al radio pedido
//   (exacto si coincide, interpolado si cae entre dos puntos guardados).
// - Las formulas REALES de grilletes/estrobos/cadenas que ya existian en
//   RigPro (mismo codigo que capEstrobos.js / grilletes.js / capCadenas.js),
//   cada una comparada contra su tabla real de fabricante.
// - Verificaciones opcionales de viento y presion de apoyo.
//
// Al generar, arma un informe imprimible: el boton "Imprimir / Guardar
// como PDF" usa window.print(), que en Chrome/Android permite elegir
// "Guardar como PDF" directamente -- sin necesitar ninguna libreria ni
// backend.

(function () {
  const CLAVE_GRUAS = "rigpro_biblioteca_gruas";

  // --- Tabla real de grilletes (Crosby G-209, screw pin, Grado 6) ---
  const TABLA_GRILLETES_REAL = [
    { pulgadas: 0.375, texto: '3/8"', ton: 1 },
    { pulgadas: 0.5, texto: '1/2"', ton: 2 },
    { pulgadas: 0.625, texto: '5/8"', ton: 3.25 },
    { pulgadas: 0.75, texto: '3/4"', ton: 4.75 },
    { pulgadas: 0.875, texto: '7/8"', ton: 6.5 },
    { pulgadas: 1, texto: '1"', ton: 8.5 },
    { pulgadas: 1.125, texto: '1-1/8"', ton: 9.5 },
    { pulgadas: 1.25, texto: '1-1/4"', ton: 12 },
    { pulgadas: 1.375, texto: '1-3/8"', ton: 13.5 },
    { pulgadas: 1.5, texto: '1-1/2"', ton: 17 },
    { pulgadas: 1.75, texto: '1-3/4"', ton: 25 },
    { pulgadas: 2, texto: '2"', ton: 35 },
    { pulgadas: 2.5, texto: '2-1/2"', ton: 55 },
    { pulgadas: 3, texto: '3"', ton: 85 },
    { pulgadas: 3.5, texto: '3-1/2"', ton: 120 },
    { pulgadas: 4, texto: '4"', ton: 150 },
  ];

  // --- Tabla real de estrobos de cable (6x19/6x37 IWRC, un tramo, 5:1) ---
  const TABLA_ESTROBOS_REAL = [
    { pulgadas: 0.25, texto: '1/4"', axial: 0.65, lazo: 0.48, canasta: 1.3 },
    { pulgadas: 0.375, texto: '3/8"', axial: 1.4, lazo: 1.1, canasta: 2.9 },
    { pulgadas: 0.5, texto: '1/2"', axial: 2.5, lazo: 1.9, canasta: 5.1 },
    { pulgadas: 0.625, texto: '5/8"', axial: 3.9, lazo: 2.9, canasta: 7.8 },
    { pulgadas: 0.75, texto: '3/4"', axial: 5.6, lazo: 4.1, canasta: 11 },
    { pulgadas: 0.875, texto: '7/8"', axial: 7.6, lazo: 5.6, canasta: 15 },
    { pulgadas: 1, texto: '1"', axial: 9.8, lazo: 7.2, canasta: 20 },
    { pulgadas: 1.125, texto: '1-1/8"', axial: 12, lazo: 9.1, canasta: 24 },
    { pulgadas: 1.25, texto: '1-1/4"', axial: 15, lazo: 11, canasta: 30 },
    { pulgadas: 1.375, texto: '1-3/8"', axial: 18, lazo: 13, canasta: 36 },
    { pulgadas: 1.5, texto: '1-1/2"', axial: 21, lazo: 16, canasta: 42 },
    { pulgadas: 1.75, texto: '1-3/4"', axial: 28, lazo: 21, canasta: 57 },
    { pulgadas: 2, texto: '2"', axial: 37, lazo: 28, canasta: 73 },
    { pulgadas: 2.25, texto: '2-1/4"', axial: 44, lazo: 35, canasta: 89 },
  ];

  // --- Parser seguro de fracciones de pulgadas (igual al de grilletes.js/capEstrobos.js) ---
  // NUNCA usar eval() -- ejecutaria como codigo cualquier texto ingresado.
  function parseCapacidad(input) {
    if (typeof input !== "string") return NaN;
    const textoOriginal = input.trim();
    if (textoOriginal === "" || textoOriginal.startsWith("-")) return NaN;
    const texto = textoOriginal.replace(/-/g, " ");
    if (!/^[0-9./\s]+$/.test(texto)) return NaN;
    const partes = texto.split(/\s+/).filter(Boolean);
    if (partes.length === 0 || partes.length > 2) return NaN;
    let total = 0;
    for (const parte of partes) {
      if (parte.includes("/")) {
        const segmentos = parte.split("/");
        if (segmentos.length !== 2) return NaN;
        const numerador = Number(segmentos[0]);
        const denominador = Number(segmentos[1]);
        if (!Number.isFinite(numerador) || !Number.isFinite(denominador) || denominador === 0) return NaN;
        total += numerador / denominador;
      } else {
        const valor = Number(parte);
        if (!Number.isFinite(valor)) return NaN;
        total += valor;
      }
    }
    return total;
  }

  // Busca/interpola en una tabla real (misma logica que grilletes.js/capEstrobos.js)
  function buscarEnTablaReal(tabla, pulgadas, campoValor) {
    let masCercano = null;
    let menorDiferencia = Infinity;
    tabla.forEach((item) => {
      const diferencia = Math.abs(item.pulgadas - pulgadas);
      if (diferencia < menorDiferencia) {
        menorDiferencia = diferencia;
        masCercano = item;
      }
    });
    if (menorDiferencia <= 0.02) {
      return { valor: masCercano[campoValor], texto: masCercano.texto, tipo: "exacto" };
    }

    const primero = tabla[0];
    const ultimo = tabla[tabla.length - 1];
    if (pulgadas < primero.pulgadas || pulgadas > ultimo.pulgadas) return null;

    for (let i = 0; i < tabla.length - 1; i++) {
      const actual = tabla[i];
      const siguiente = tabla[i + 1];
      if (pulgadas > actual.pulgadas && pulgadas < siguiente.pulgadas) {
        const proporcion = (pulgadas - actual.pulgadas) / (siguiente.pulgadas - actual.pulgadas);
        const interpolado = actual[campoValor] + (siguiente[campoValor] - actual[campoValor]) * proporcion;
        return { valor: interpolado, texto: `entre ${actual.texto} y ${siguiente.texto}`, tipo: "interpolado" };
      }
    }
    return null;
  }

  function calcularGrillete(pulgadas) {
    const real = buscarEnTablaReal(TABLA_GRILLETES_REAL, pulgadas, "ton");
    return real ? real.valor : pulgadas * pulgadas * 8.5;
  }

  function calcularEstrobo(pulgadas, tipoAmarre) {
    const real = buscarEnTablaReal(TABLA_ESTROBOS_REAL, pulgadas, tipoAmarre);
    if (real) return real.valor;
    let formula = pulgadas * pulgadas * 9.72;
    if (tipoAmarre === "lazo") formula *= 0.75;
    else if (tipoAmarre === "canasta") formula *= 2;
    return formula;
  }

  function calcularCadenaTon(mm, grado) {
    const factor = Math.pow(mm / 26, 2);
    const kg = grado === 10 ? factor * 27060 : factor * 21700;
    return kg / 1000; // a toneladas, para ser consistentes con el resto del plan
  }

  // --- Biblioteca de grúas: buscar capacidad para un radio (exacta o interpolada) ---
  function leerGruasBiblioteca() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_GRUAS)) || [];
    } catch (e) {
      return [];
    }
  }

  function buscarCapacidadParaRadio(puntos, radioDeseado) {
    if (!puntos || puntos.length === 0) return null;
    const ordenados = [...puntos].sort((a, b) => a.radio - b.radio);

    const exacto = ordenados.find((p) => Math.abs(p.radio - radioDeseado) <= 0.1);
    if (exacto) {
      return { capacidad: exacto.capacidad, tipo: "exacto", detalle: exacto };
    }

    const primero = ordenados[0];
    const ultimo = ordenados[ordenados.length - 1];
    if (radioDeseado < primero.radio || radioDeseado > ultimo.radio) return null;

    for (let i = 0; i < ordenados.length - 1; i++) {
      const actual = ordenados[i];
      const siguiente = ordenados[i + 1];
      if (radioDeseado > actual.radio && radioDeseado < siguiente.radio) {
        const proporcion = (radioDeseado - actual.radio) / (siguiente.radio - actual.radio);
        const capacidadInterpolada =
          actual.capacidad + (siguiente.capacidad - actual.capacidad) * proporcion;
        return {
          capacidad: capacidadInterpolada,
          tipo: "interpolado",
          entre: [actual, siguiente],
        };
      }
    }
    return null;
  }

  function formatearTon(valor) {
    return valor.toFixed(2) + " Ton";
  }

  function claseSemaforo(porcentaje) {
    if (porcentaje >= 100) return "excede";
    if (porcentaje >= 90) return "excede";
    if (porcentaje >= 75) return "precaucion";
    return "";
  }

  // --- Elementos del DOM ---
  const elGrua = document.getElementById("piGrua");
  const elTipoAparejo = document.getElementById("piTipoAparejo");
  const elCamposEstrobo = document.getElementById("piCamposEstrobo");
  const elCamposCadena = document.getElementById("piCamposCadena");
  const elIncluirViento = document.getElementById("piIncluirViento");
  const elCamposViento = document.getElementById("piCamposViento");
  const elIncluirPresion = document.getElementById("piIncluirPresion");
  const elCamposPresion = document.getElementById("piCamposPresion");
  const elBtnGenerar = document.getElementById("piBtnGenerar");
  const elFormSeccion = document.getElementById("piFormSeccion");
  const elInforme = document.getElementById("piInforme");
  const elHoja = document.getElementById("piHoja");
  const elBtnImprimir = document.getElementById("piBtnImprimir");
  const elBtnNuevo = document.getElementById("piBtnNuevo");

  function poblarSelectGruas() {
    const gruas = leerGruasBiblioteca();
    elGrua.innerHTML = "";
    if (gruas.length === 0) {
      const opcion = document.createElement("option");
      opcion.textContent = "No tienes grúas guardadas — ve a Biblioteca de Grúas primero";
      opcion.value = "";
      elGrua.appendChild(opcion);
      return;
    }
    gruas.forEach((grua) => {
      const opcion = document.createElement("option");
      opcion.value = grua.id;
      opcion.textContent = grua.modelo + " (" + grua.puntos.length + " puntos)";
      elGrua.appendChild(opcion);
    });

    // Si llegamos desde "Generar Plan de Izaje con esta grúa" en la
    // Biblioteca de Grúas, el id viene en la URL (?gruaId=...) -- la
    // preseleccionamos para no obligar al usuario a buscarla de nuevo.
    const idDesdeUrl = new URLSearchParams(window.location.search).get("gruaId");
    if (idDesdeUrl && gruas.some((g) => g.id === idDesdeUrl)) {
      elGrua.value = idDesdeUrl;
    }
  }

  elTipoAparejo.addEventListener("change", () => {
    const esEstrobo = elTipoAparejo.value === "estrobo";
    elCamposEstrobo.style.display = esEstrobo ? "block" : "none";
    elCamposCadena.style.display = esEstrobo ? "none" : "block";
  });

  elIncluirViento.addEventListener("change", () => {
    elCamposViento.style.display = elIncluirViento.checked ? "block" : "none";
  });
  elIncluirPresion.addEventListener("change", () => {
    elCamposPresion.style.display = elIncluirPresion.checked ? "block" : "none";
  });

  function generarPlan() {
    const gruas = leerGruasBiblioteca();
    const grua = gruas.find((g) => g.id === elGrua.value);
    if (!grua) {
      alert("Selecciona una grúa válida de tu biblioteca.");
      return;
    }

    const radioDeseado = parseFloat(document.getElementById("piRadio").value);
    const pesoCarga = parseFloat(document.getElementById("piPeso").value);
    if (!radioDeseado || radioDeseado <= 0) {
      alert("Ingresa el radio de trabajo.");
      return;
    }
    if (!pesoCarga || pesoCarga <= 0) {
      alert("Ingresa el peso de la carga.");
      return;
    }

    const capacidadGrua = buscarCapacidadParaRadio(grua.puntos, radioDeseado);
    if (!capacidadGrua) {
      alert(
        "No hay ningún punto guardado cerca de ese radio para esta grúa (o está fuera del " +
          "rango que tienes guardado). Agrega un punto más cercano en Biblioteca de Grúas."
      );
      return;
    }

    const porcentajeGrua = (pesoCarga / capacidadGrua.capacidad) * 100;

    // --- Aparejo principal ---
    let aparejoTexto = "";
    let capacidadAparejo = null;
    let aparejoValido = true;

    if (elTipoAparejo.value === "estrobo") {
      const pulgadas = parseCapacidad(document.getElementById("piDiametroEstrobo").value);
      const amarre = document.getElementById("piAmarreEstrobo").value;
      if (isNaN(pulgadas) || pulgadas <= 0) {
        alert("Ingresa un diámetro de estrobo válido (ej: 7/8, 1 1/2).");
        return;
      }
      capacidadAparejo = calcularEstrobo(pulgadas, amarre);
      const nombreAmarre = { axial: "Axial", lazo: "Lazo", canasta: "Canasta" }[amarre];
      aparejoTexto = `Estrobo de cable ${document.getElementById("piDiametroEstrobo").value}" — amarre ${nombreAmarre}`;
    } else {
      const mm = parseFloat(document.getElementById("piMmCadena").value);
      const grado = parseInt(document.getElementById("piGradoCadena").value, 10);
      if (!mm || mm <= 0) {
        alert("Ingresa el diámetro de la cadena en mm.");
        return;
      }
      capacidadAparejo = calcularCadenaTon(mm, grado);
      aparejoTexto = `Cadena Grado ${grado}, ${mm} mm`;
    }

    const porcentajeAparejo = (pesoCarga / capacidadAparejo) * 100;

    // --- Grillete ---
    const pulgadasGrillete = parseCapacidad(document.getElementById("piDiametroGrillete").value);
    if (isNaN(pulgadasGrillete) || pulgadasGrillete <= 0) {
      alert("Ingresa un diámetro de grillete válido (ej: 1, 1 1/4).");
      return;
    }
    const capacidadGrillete = calcularGrillete(pulgadasGrillete);
    const porcentajeGrillete = (pesoCarga / capacidadGrillete) * 100;

    // --- Viento (opcional) ---
    let vientoResultado = null;
    if (elIncluirViento.checked) {
      const vientoActual = parseFloat(document.getElementById("piVientoActual").value);
      const vientoLimite = parseFloat(document.getElementById("piVientoLimite").value);
      if (vientoActual >= 0 && vientoLimite > 0) {
        vientoResultado = {
          actual: vientoActual,
          limite: vientoLimite,
          excede: vientoActual >= vientoLimite,
          precaucion: vientoActual >= vientoLimite * 0.8,
        };
      }
    }

    // --- Presión de apoyo (opcional) ---
    let presionResultado = null;
    if (elIncluirPresion.checked) {
      const cargaPata = parseFloat(document.getElementById("piCargaPata").value);
      const capacidadTerreno = parseFloat(document.getElementById("piCapacidadTerreno").value);
      if (cargaPata > 0 && capacidadTerreno > 0) {
        presionResultado = {
          cargaPata,
          capacidadTerreno,
          excede: cargaPata > capacidadTerreno,
        };
      }
    }

    // --- Resultado general ---
    const porcentajes = [porcentajeGrua, porcentajeAparejo, porcentajeGrillete];
    const maxPorcentaje = Math.max(...porcentajes);
    let resultadoGeneral = "apto";
    if (maxPorcentaje >= 100 || (vientoResultado && vientoResultado.excede) || (presionResultado && presionResultado.excede)) {
      resultadoGeneral = "no-apto";
    } else if (maxPorcentaje >= 75 || (vientoResultado && vientoResultado.precaucion)) {
      resultadoGeneral = "observaciones";
    }

    renderizarInforme({
      fecha: document.getElementById("piFecha").value,
      proyecto: document.getElementById("piProyecto").value.trim(),
      responsable: document.getElementById("piResponsable").value.trim(),
      grua,
      radioDeseado,
      pesoCarga,
      capacidadGrua,
      porcentajeGrua,
      aparejoTexto,
      capacidadAparejo,
      porcentajeAparejo,
      pulgadasGrillete: document.getElementById("piDiametroGrillete").value,
      capacidadGrillete,
      porcentajeGrillete,
      vientoResultado,
      presionResultado,
      notas: document.getElementById("piNotas").value.trim(),
      resultadoGeneral,
    });
  }

  function filaCapacidadHtml(etiqueta, capacidadObj, porcentaje) {
    const claseP = claseSemaforo(porcentaje);
    const detalleTipo =
      capacidadObj && capacidadObj.tipo === "interpolado"
        ? " (interpolado entre puntos guardados — estimado)"
        : capacidadObj && capacidadObj.tipo === "exacto"
        ? " (punto exacto guardado)"
        : "";
    return `
      <tr>
        <td>${etiqueta}</td>
        <td>${formatearTon(capacidadObj.capacidad !== undefined ? capacidadObj.capacidad : capacidadObj)}${detalleTipo}</td>
        <td class="pi-aviso-item ${claseP}">${porcentaje.toFixed(1)}%</td>
      </tr>`;
  }

  function renderizarInforme(datos) {
    const textoResultado = {
      apto: "✓ APTO",
      observaciones: "⚠ APTO CON OBSERVACIONES",
      "no-apto": "⛔ NO APTO",
    }[datos.resultadoGeneral];

    let filaGrua = filaCapacidadHtml("Grúa (" + datos.grua.modelo + ")", datos.capacidadGrua, datos.porcentajeGrua);
    let filaAparejo = filaCapacidadHtml(datos.aparejoTexto, datos.capacidadAparejo, datos.porcentajeAparejo);
    let filaGrillete = filaCapacidadHtml(
      'Grillete ' + datos.pulgadasGrillete + '"',
      datos.capacidadGrillete,
      datos.porcentajeGrillete
    );

    let bloqueViento = "";
    if (datos.vientoResultado) {
      const v = datos.vientoResultado;
      const estado = v.excede ? "⛔ EXCEDE el límite" : v.precaucion ? "⚠ Cerca del límite" : "✓ Dentro de rango";
      bloqueViento = `<h4>Viento</h4><p>${v.actual} km/h actual vs ${v.limite} km/h límite del fabricante — ${estado}</p>`;
    }

    let bloquePresion = "";
    if (datos.presionResultado) {
      const p = datos.presionResultado;
      const estado = p.excede ? "⛔ EXCEDE la capacidad del terreno" : "✓ Dentro de la capacidad del terreno";
      bloquePresion = `<h4>Presión de apoyo</h4><p>Carga ${p.cargaPata.toFixed(2)} Ton/m² vs capacidad terreno ${p.capacidadTerreno.toFixed(2)} Ton/m² — ${estado}</p>`;
    }

    elHoja.innerHTML = `
      <h2>PLAN DE IZAJE</h2>
      <table>
        <tr><td><strong>Fecha:</strong></td><td>${datos.fecha || "-"}</td></tr>
        <tr><td><strong>Proyecto/Ubicación:</strong></td><td>${datos.proyecto || "-"}</td></tr>
        <tr><td><strong>Responsable:</strong></td><td>${datos.responsable || "-"}</td></tr>
      </table>

      <h4>Grúa y maniobra</h4>
      <table>
        <tr><td>Radio de trabajo</td><td>${datos.radioDeseado} m</td></tr>
        <tr><td>Peso de la carga</td><td>${formatearTon(datos.pesoCarga)}</td></tr>
      </table>

      <h4>Verificación de capacidades</h4>
      <table>
        <tr><td><strong>Elemento</strong></td><td><strong>Capacidad</strong></td><td><strong>% usado</strong></td></tr>
        ${filaGrua}
        ${filaAparejo}
        ${filaGrillete}
      </table>

      ${bloqueViento}
      ${bloquePresion}

      ${datos.notas ? "<h4>Notas</h4><p>" + datos.notas.replace(/</g, "&lt;") + "</p>" : ""}

      <div class="pi-resultado-general ${datos.resultadoGeneral}">${textoResultado}</div>

      <p style="font-size:0.8em;">
        Este plan es una referencia calculada a partir de datos ingresados por el operador
        y de la biblioteca personal de grúas. No reemplaza el juicio del supervisor de izaje
        ni la tabla de carga física del fabricante.
      </p>

      <div class="pi-firma">
        <div>Firma responsable</div>
        <div>Firma supervisor</div>
      </div>
    `;

    elFormSeccion.style.display = "none";
    elInforme.style.display = "block";
    elInforme.scrollIntoView({ behavior: "smooth" });
  }

  elBtnGenerar.addEventListener("click", generarPlan);
  elBtnImprimir.addEventListener("click", () => window.print());
  elBtnNuevo.addEventListener("click", () => {
    elFormSeccion.style.display = "block";
    elInforme.style.display = "none";
  });

  poblarSelectGruas();
})();
