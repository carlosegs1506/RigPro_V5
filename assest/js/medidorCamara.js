// medidorCamara.js
//
// Medidor de distancias con camara usando WebXR Device API (hit-test +
// anchors) + Three.js. Solo funciona en navegadores/contextos que
// soporten "immersive-ar" -- en la practica, Chrome en Android con
// ARCore. Dentro de RigPro empaquetado como TWA, esto corre sobre el
// Chrome real del sistema, asi que deberia funcionar igual que en el
// navegador.
//
// MODO DE PUNTOS ENCADENADOS: cada toque en la pantalla agrega un punto
// nuevo. A partir del segundo punto, cada punto se conecta con el
// ANTERIOR (no solo el primero con el segundo), formando un recorrido
// continuo -- util para recorrer, por ejemplo, las 4 esquinas de un
// objeto y obtener el perimetro completo. Se muestra el tramo recien
// medido y el total acumulado de todos los tramos.
//
// Flujo:
// 1. Al cargar la pagina, se revisa si el navegador soporta AR.
// 2. Si soporta, se habilita el boton "Iniciar medicion AR".
// 3. Al entrar en AR, se muestra un reticulo (anillo) que sigue las
//    superficies reales detectadas, con la posicion suavizada (promedio
//    de las ultimas lecturas) para que no tiemble.
// 4. Cada toque marca un punto nuevo, anclado con un WebXR Anchor para
//    que ARCore lo siga rastreando y no se desplace visualmente al
//    moverte. Desde el segundo punto en adelante, se dibuja el tramo
//    hacia el punto anterior y se suma al total.
// 5. "Nueva medicion" limpia todo para empezar un recorrido nuevo.

(function () {
  const CLAVE_HISTORIAL = "rigpro_medidor_historial";

  // Cuantas lecturas recientes del hit-test se promedian para suavizar
  // el reticulo y la posicion de cada punto marcado.
  const TAMANIO_BUFFER_ESTABILIZACION = 8;

  let renderer, scene, camera, reticle, xrSession, hitTestSource, xrRefSpace;
  let puntos = []; // Vector3[] de todos los puntos marcados en el recorrido actual
  let anclas = []; // (XRAnchor|null)[] -- un anchor por punto, en el mismo orden que "puntos"
  let marcadores = []; // Mesh[] de las esferas que marcan cada punto
  let segmentos = []; // Mesh[] de las lineas entre cada punto y el anterior
  let distanciaTotal = 0; // suma de todos los tramos del recorrido actual
  let bufferPosicionesReticulo = []; // Vector3[] -- ultimas lecturas crudas, para el promedio
  let anchorsSoportado = false; // se confirma apenas arranca la sesion AR

  const elMensajeCompatibilidad = document.getElementById("mensajeCompatibilidad");
  const elBtnIniciarAR = document.getElementById("btnIniciarAR");
  const elArOverlay = document.getElementById("arOverlay");
  const elArCanvasContainer = document.getElementById("arCanvasContainer");
  const elArInstruccion = document.getElementById("arInstruccion");
  const elArDistancia = document.getElementById("arDistancia");
  const elArPromedio = document.getElementById("arPromedio"); // ahora muestra el TOTAL acumulado
  const elBtnNuevaMedicion = document.getElementById("btnNuevaMedicion");
  const elBtnSalirAR = document.getElementById("btnSalirAR");
  const elBtnDeshacerPunto = document.getElementById("btnDeshacerPunto");
  const elListaMediciones = document.getElementById("listaMediciones");
  const elBtnBorrarHistorial = document.getElementById("btnBorrarHistorial");
  const elPanelErrorAR = document.getElementById("panelErrorAR");
  const elMensajeErrorAR = document.getElementById("mensajeErrorAR");
  const elBtnCerrarPanelError = document.getElementById("btnCerrarPanelError");

  function mostrarPanelError(mensaje) {
    elMensajeErrorAR.textContent = mensaje;
    elPanelErrorAR.style.display = "block";
  }

  elBtnCerrarPanelError.addEventListener("click", () => {
    elPanelErrorAR.style.display = "none";
  });

  function formatearDistancia(metros) {
    return metros < 1 ? `${(metros * 100).toFixed(1)} cm` : `${metros.toFixed(2)} m`;
  }

  // --- 1. Comprobar compatibilidad al cargar la pagina ---
  async function comprobarCompatibilidad() {
    if (!("xr" in navigator)) {
      mostrarNoCompatible(
        "Tu navegador no tiene soporte WebXR. Abre esta página en Chrome " +
          "para Android (o desde la app RigPro instalada), no en otro navegador."
      );
      return;
    }

    try {
      const soportado = await navigator.xr.isSessionSupported("immersive-ar");
      if (!soportado) {
        mostrarNoCompatible(
          "Tu dispositivo no soporta realidad aumentada (ARCore). Esta " +
            "función necesita un celular Android compatible con ARCore."
        );
        return;
      }
      elMensajeCompatibilidad.textContent =
        "Tu dispositivo es compatible. Toca el botón para empezar a medir.";
      elBtnIniciarAR.disabled = false;
      document.getElementById("linkInstalarArcorePrevio").style.display = "block";
    } catch (error) {
      mostrarNoCompatible(
        "No se pudo comprobar la compatibilidad AR de tu dispositivo. (" +
          error.message +
          ")"
      );
    }
  }

  function mostrarNoCompatible(mensaje) {
    elMensajeCompatibilidad.textContent = mensaje;
    elBtnIniciarAR.disabled = true;
  }

  // --- 2. Iniciar sesion AR ---
  async function iniciarAR() {
    elBtnIniciarAR.disabled = true;
    elBtnIniciarAR.textContent = "Iniciando cámara…";

    const tiempoLimiteMs = 15000;
    let seAgotoElTiempo = false;
    const timeoutId = setTimeout(() => {
      seAgotoElTiempo = true;
      elBtnIniciarAR.disabled = false;
      elBtnIniciarAR.textContent = "Iniciar medición AR";
      mostrarPanelError(
        "La cámara AR está tardando demasiado en iniciar. Es probable que " +
          "falte instalar o actualizar \"Google Play Services para RA\" " +
          "(ARCore) en tu dispositivo."
      );
    }, tiempoLimiteMs);

    elArCanvasContainer.classList.add("activo");
    elArOverlay.classList.add("activo");

    try {
      xrSession = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay", "anchors"],
        domOverlay: { root: elArOverlay },
      });
    } catch (error) {
      clearTimeout(timeoutId);
      elArCanvasContainer.classList.remove("activo");
      elArOverlay.classList.remove("activo");
      if (!seAgotoElTiempo) {
        mostrarPanelError(
          "No se pudo iniciar la sesión de AR: " +
            error.message +
            ". Revisa que le hayas dado permiso de cámara a la app, o que " +
            "tengas ARCore instalado y actualizado."
        );
        elBtnIniciarAR.disabled = false;
        elBtnIniciarAR.textContent = "Iniciar medición AR";
      }
      return;
    }

    clearTimeout(timeoutId);
    if (seAgotoElTiempo) {
      elArCanvasContainer.classList.remove("activo");
      elArOverlay.classList.remove("activo");
      await xrSession.end();
      return;
    }

    configurarEscenaThreeJs();

    xrSession.addEventListener("end", finalizarAR);
    xrSession.addEventListener("select", alTocarPantalla);

    try {
      const viewerSpace = await xrSession.requestReferenceSpace("viewer");
      hitTestSource = await xrSession.requestHitTestSource({ space: viewerSpace });

      renderer.xr.setReferenceSpaceType("local");
      await renderer.xr.setSession(xrSession);
      xrRefSpace = renderer.xr.getReferenceSpace();
    } catch (error) {
      mostrarPanelError(
        "Ocurrió un problema iniciando la medición AR: " +
          error.message +
          ". Se va a cerrar la sesión, vuelve a intentarlo."
      );
      await xrSession.end();
      return;
    }

    anchorsSoportado = !!(
      xrSession.enabledFeatures && xrSession.enabledFeatures.includes("anchors")
    );

    reiniciarMedicionActual();

    renderer.setAnimationLoop(renderizarFrame);
  }

  function configurarEscenaThreeJs() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();

    const luz = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(luz);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    elArCanvasContainer.innerHTML = "";
    elArCanvasContainer.appendChild(renderer.domElement);

    const geometriaReticulo = new THREE.RingGeometry(0.05, 0.06, 32).rotateX(
      -Math.PI / 2
    );
    const materialReticulo = new THREE.MeshBasicMaterial({ color: 0xffd60a });
    reticle = new THREE.Mesh(geometriaReticulo, materialReticulo);
    reticle.visible = false;
    scene.add(reticle);
  }

  // --- 3. Loop de renderizado ---
  function renderizarFrame(timestamp, frame) {
    if (!frame) return;

    const results = frame.getHitTestResults(hitTestSource);

    if (results.length > 0) {
      const hit = results[0];
      const pose = hit.getPose(xrRefSpace);

      const matrizHit = new THREE.Matrix4().fromArray(pose.transform.matrix);
      const posicionCruda = new THREE.Vector3();
      const rotacionCruda = new THREE.Quaternion();
      const escalaCruda = new THREE.Vector3();
      matrizHit.decompose(posicionCruda, rotacionCruda, escalaCruda);

      agregarMuestraReticulo(posicionCruda);
      reticle.visible = true;
      reticle.position.copy(calcularPosicionPromedioReticulo());
      reticle.quaternion.copy(rotacionCruda);

      if (puntos.length === 0) {
        elArInstruccion.textContent = "Apunta al primer punto y toca la pantalla";
      }
    } else {
      reticle.visible = false;
      bufferPosicionesReticulo = [];

      if (puntos.length === 0) {
        elArInstruccion.textContent =
          "Buscando superficie… mueve el celular lentamente de lado a lado";
      }
    }

    actualizarPuntosAnclados(frame);

    renderer.render(scene, camera);
  }

  function agregarMuestraReticulo(posicion) {
    bufferPosicionesReticulo.push(posicion.clone());
    if (bufferPosicionesReticulo.length > TAMANIO_BUFFER_ESTABILIZACION) {
      bufferPosicionesReticulo.shift();
    }
  }

  function calcularPosicionPromedioReticulo() {
    const promedio = new THREE.Vector3();
    bufferPosicionesReticulo.forEach((p) => promedio.add(p));
    promedio.divideScalar(bufferPosicionesReticulo.length);
    return promedio;
  }

  // Los puntos ya marcados que tienen un anchor de WebXR asociado se
  // re-consultan cada frame para que se mantengan pegados al mismo lugar
  // real. Si alguno se corrigio, hay que re-dibujar todos los tramos
  // (son baratos de recrear, son solo lineas) y recalcular el total.
  function actualizarPuntosAnclados(frame) {
    let huboActualizacion = false;

    for (let i = 0; i < anclas.length; i++) {
      const ancla = anclas[i];
      if (!ancla) continue;

      const pose = frame.getPose(ancla.anchorSpace, xrRefSpace);
      if (!pose) continue;

      const nuevaPosicion = new THREE.Vector3().setFromMatrixPosition(
        new THREE.Matrix4().fromArray(pose.transform.matrix)
      );
      puntos[i].copy(nuevaPosicion);
      marcadores[i].position.copy(nuevaPosicion);
      huboActualizacion = true;
    }

    if (huboActualizacion && puntos.length >= 2) {
      redibujarTodosLosSegmentos();
    }
  }

  // --- 4. Al tocar la pantalla: marcar un punto ---
  async function alTocarPantalla(evento) {
    if (!reticle.visible) return;

    const posicion = reticle.position.clone();

    let ancla = null;
    const frameDelEvento = evento && evento.frame ? evento.frame : null;

    if (
      anchorsSoportado &&
      frameDelEvento &&
      typeof frameDelEvento.createAnchor === "function"
    ) {
      try {
        const transform = new XRRigidTransform({
          x: posicion.x,
          y: posicion.y,
          z: posicion.z,
        });
        ancla = await frameDelEvento.createAnchor(transform, xrRefSpace);
      } catch (error) {
        ancla = null;
      }
    }

    agregarPunto(posicion, ancla);
  }

  function agregarPunto(posicion, ancla) {
    puntos.push(posicion.clone());
    anclas.push(ancla || null);

    const geometriaEsfera = new THREE.SphereGeometry(0.012, 16, 16);
    const materialEsfera = new THREE.MeshBasicMaterial({ color: 0xffd60a });
    const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
    esfera.position.copy(posicion);
    scene.add(esfera);
    marcadores.push(esfera);

    // Desde el segundo punto en adelante, se conecta con el ANTERIOR
    // (no solo el primero con el segundo) y se suma al total.
    if (puntos.length >= 2) {
      const p1 = puntos[puntos.length - 2];
      const p2 = puntos[puntos.length - 1];
      const distanciaTramo = p1.distanceTo(p2);
      dibujarSegmento(p1, p2);
      distanciaTotal += distanciaTramo;
      guardarMedicionEnHistorial(distanciaTramo);
    }

    actualizarTextosSegunPuntos();
  }

  function dibujarSegmento(p1, p2) {
    const geometriaLinea = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const materialLinea = new THREE.LineBasicMaterial({ color: 0xffd60a, linewidth: 3 });
    const linea = new THREE.Line(geometriaLinea, materialLinea);
    scene.add(linea);
    segmentos.push(linea);
  }

  function redibujarTodosLosSegmentos() {
    segmentos.forEach((s) => scene.remove(s));
    segmentos = [];
    distanciaTotal = 0;
    for (let i = 1; i < puntos.length; i++) {
      const p1 = puntos[i - 1];
      const p2 = puntos[i];
      dibujarSegmento(p1, p2);
      distanciaTotal += p1.distanceTo(p2);
    }
    actualizarTextosSegunPuntos();
  }

  // Centraliza que texto mostrar segun cuantos puntos hay marcados.
  function actualizarTextosSegunPuntos() {
    if (puntos.length === 0) {
      elArDistancia.style.display = "none";
      elArPromedio.style.display = "none";
      elArInstruccion.textContent =
        reticle && reticle.visible
          ? "Apunta al primer punto y toca la pantalla"
          : "Buscando superficie… mueve el celular lentamente de lado a lado";
      return;
    }

    if (puntos.length === 1) {
      elArDistancia.style.display = "none";
      elArPromedio.style.display = "none";
      elArInstruccion.textContent = "Ahora apunta al siguiente punto y toca la pantalla";
      return;
    }

    const ultimoTramo = puntos[puntos.length - 2].distanceTo(puntos[puntos.length - 1]);
    elArDistancia.textContent = formatearDistancia(ultimoTramo) + " (último tramo)";
    elArDistancia.style.display = "block";

    if (puntos.length > 2) {
      elArPromedio.textContent =
        "Total acumulado (" + (puntos.length - 1) + " tramos): " +
        formatearDistancia(distanciaTotal);
      elArPromedio.style.display = "block";
    } else {
      elArPromedio.style.display = "none";
    }

    elArInstruccion.textContent =
      "Toca el siguiente punto para seguir midiendo, o \"Nueva medición\" para terminar";
  }

  // --- 5. Controles de la sesion ---
  function reiniciarMedicionActual() {
    puntos = [];
    anclas.forEach((a) => {
      if (a && typeof a.delete === "function") a.delete();
    });
    anclas = [];
    marcadores.forEach((m) => scene.remove(m));
    marcadores = [];
    segmentos.forEach((s) => scene.remove(s));
    segmentos = [];
    distanciaTotal = 0;
    actualizarTextosSegunPuntos();
  }

  function deshacerUltimoPunto() {
    if (puntos.length === 0) return;

    // Si el punto que se va a quitar tenia un tramo que lo conectaba
    // con el anterior, hay que borrar ese tramo y restar su distancia
    // del total.
    if (puntos.length >= 2) {
      const ultimoSegmento = segmentos.pop();
      if (ultimoSegmento) scene.remove(ultimoSegmento);
      const distanciaTramo = puntos[puntos.length - 2].distanceTo(puntos[puntos.length - 1]);
      distanciaTotal -= distanciaTramo;
    }

    puntos.pop();
    const ultimaAncla = anclas.pop();
    if (ultimaAncla && typeof ultimaAncla.delete === "function") {
      ultimaAncla.delete();
    }
    const ultimoMarcador = marcadores.pop();
    if (ultimoMarcador) scene.remove(ultimoMarcador);

    actualizarTextosSegunPuntos();
  }

  async function salirDeAR() {
    if (xrSession) {
      await xrSession.end();
    }
  }

  function finalizarAR() {
    renderer.setAnimationLoop(null);
    elArCanvasContainer.classList.remove("activo");
    elArOverlay.classList.remove("activo");
    xrSession = null;
    hitTestSource = null;
    bufferPosicionesReticulo = [];
    elBtnIniciarAR.disabled = false;
    elBtnIniciarAR.textContent = "Iniciar medición AR";
  }

  // --- 6. Historial de mediciones (guardado local en el dispositivo) ---
  function leerHistorial() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarMedicionEnHistorial(distanciaMetros) {
    let historial = leerHistorial();
    historial.unshift({
      valor: distanciaMetros,
      fecha: new Date().toLocaleString("es-CL"),
    });
    historial = historial.slice(0, 20);
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    renderizarHistorial();
  }

  function borrarMedicion(indice) {
    const historial = leerHistorial();
    historial.splice(indice, 1);
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    renderizarHistorial();
  }

  function borrarTodoElHistorial() {
    localStorage.removeItem(CLAVE_HISTORIAL);
    renderizarHistorial();
  }

  function renderizarHistorial() {
    const historial = leerHistorial();

    elListaMediciones.innerHTML = "";

    if (historial.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Todavía no has hecho ninguna medición.";
      elListaMediciones.appendChild(li);
      elBtnBorrarHistorial.style.display = "none";
      return;
    }

    elBtnBorrarHistorial.style.display = "block";

    historial.forEach((item, indice) => {
      const li = document.createElement("li");
      li.className = "item-historial";

      const texto = formatearDistancia(item.valor);

      const spanTexto = document.createElement("span");
      spanTexto.textContent = `${texto} — ${item.fecha}`;

      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "✕";
      btnBorrar.className = "btn-borrar-medicion";
      btnBorrar.setAttribute("aria-label", "Borrar esta medición");
      btnBorrar.addEventListener("click", () => borrarMedicion(indice));

      li.appendChild(spanTexto);
      li.appendChild(btnBorrar);
      elListaMediciones.appendChild(li);
    });
  }

  // --- Eventos de los botones ---
  elBtnIniciarAR.addEventListener("click", iniciarAR);
  elBtnNuevaMedicion.addEventListener("click", reiniciarMedicionActual);
  elBtnSalirAR.addEventListener("click", salirDeAR);
  elBtnDeshacerPunto.addEventListener("click", deshacerUltimoPunto);
  elBtnBorrarHistorial.addEventListener("click", () => {
    if (confirm("¿Borrar todas las mediciones guardadas? No se puede deshacer.")) {
      borrarTodoElHistorial();
    }
  });

  window.addEventListener("resize", () => {
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });

  // --- Arranque ---
  comprobarCompatibilidad();
  renderizarHistorial();
})();
