// medidorCamara.js
//
// Medidor de distancias con camara usando WebXR Device API (hit-test +
// anchors) + Three.js. Solo funciona en navegadores/contextos que
// soporten "immersive-ar" -- en la practica, Chrome en Android con
// ARCore. Dentro de RigPro empaquetado como TWA, esto corre sobre el
// Chrome real del sistema, asi que deberia funcionar igual que en el
// navegador.
//
// NOTA: se probo agregar el Depth API de WebXR para acelerar la
// deteccion de superficie, pero en pruebas reales resulto MAS lento en
// el dispositivo de prueba (probablemente por el costo de procesar
// profundidad por pixel en JavaScript en hardware mas limitado) -- se
// revirtio. La investigacion de apps similares en Play Store (AR Ruler,
// Regla AR, Google Measure) confirmo que incluso esas apps nativas
// (no basadas en navegador) tienen la misma demora inicial de "mueve el
// celular para que la app detecte el entorno" -- es una limitacion del
// propio ARCore, no de esta implementacion.
//
// Flujo:
// 1. Al cargar la pagina, se revisa si el navegador soporta AR.
// 2. Si soporta, se habilita el boton "Iniciar medicion AR".
// 3. Al entrar en AR, se muestra un reticulo (anillo) que sigue las
//    superficies reales detectadas, con la posicion suavizada (promedio
//    de las ultimas lecturas) para que no tiemble.
// 4. El usuario toca la pantalla para marcar el primer punto, apunta a
//    otro lugar y toca de nuevo para el segundo punto. Cada punto se
//    ancla con un WebXR Anchor para que ARCore lo siga rastreando y no
//    se desplace visualmente al moverte.
// 5. Se calcula la distancia euclidiana 3D entre ambos puntos y se
//    muestra en metros/centimetros. Si repites la misma medicion varias
//    veces seguidas (tocando "Nueva medicion" y volviendo a marcar los
//    2 puntos), se muestra tambien el promedio de las ultimas 3 --
//    siguiendo la misma recomendacion que da AR Ruler para mejorar la
//    confianza en el resultado.

(function () {
  const CLAVE_HISTORIAL = "rigpro_medidor_historial";

  // Cuantas lecturas recientes del hit-test se promedian para suavizar
  // el reticulo y la posicion de cada punto marcado.
  const TAMANIO_BUFFER_ESTABILIZACION = 8;

  // Cuantas mediciones repetidas seguidas se promedian para mostrar el
  // "promedio de las ultimas N".
  const TAMANIO_BUFFER_MEDICIONES_REPETIDAS = 3;

  let renderer, scene, camera, reticle, xrSession, hitTestSource, xrRefSpace;
  let puntos = []; // Vector3[] de los puntos marcados en la medicion actual
  let anclas = []; // (XRAnchor|null)[] -- un anchor por punto, en el mismo orden que "puntos"
  let marcadores = []; // Mesh[] de las esferas que marcan cada punto
  let lineaActual = null; // Mesh de la linea entre los 2 puntos
  let bufferPosicionesReticulo = []; // Vector3[] -- ultimas lecturas crudas, para el promedio del reticulo
  let ultimasDistancias = []; // number[] -- ultimas mediciones completas seguidas, para el promedio
  let anchorsSoportado = false; // se confirma apenas arranca la sesion AR

  const elMensajeCompatibilidad = document.getElementById("mensajeCompatibilidad");
  const elBtnIniciarAR = document.getElementById("btnIniciarAR");
  const elArOverlay = document.getElementById("arOverlay");
  const elArCanvasContainer = document.getElementById("arCanvasContainer");
  const elArInstruccion = document.getElementById("arInstruccion");
  const elArDistancia = document.getElementById("arDistancia");
  const elArPromedio = document.getElementById("arPromedio");
  const elArDebugAnchors = document.getElementById("arDebugAnchors");
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

    // Si requestSession no responde en un tiempo razonable, lo mas probable
    // es que falte "Google Play Services para RA" (ARCore) instalado en el
    // dispositivo -- Chrome no siempre avisa esto con un error claro, se
    // queda esperando indefinidamente. Con este timeout evitamos que la
    // pantalla quede pegada sin ninguna explicacion.
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

    // El elemento del dom-overlay debe estar visible ANTES de pedir la
    // sesion -- si sigue en display:none al momento de requestSession(),
    // Chrome puede quedarse esperando indefinidamente en vez de completar
    // el inicio de la sesion. Por eso se activa aca, antes del try/catch,
    // y se revierte si algo falla.
    elArCanvasContainer.classList.add("activo");
    elArOverlay.classList.add("activo");

    try {
      xrSession = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        // "anchors" es opcional: si el dispositivo no lo soporta, el
        // resto de la app sigue funcionando igual, solo que sin la
        // correccion automatica de deriva en los puntos ya marcados.
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
      // El timeout ya disparo su propia alerta y restauro el boton; si la
      // sesion igual llega a resolver tarde, la cerramos para no quedar en
      // un estado inconsistente.
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
      // Usamos el mismo reference space que ya maneja Three.js internamente
      // en vez de pedir uno propio por separado (redundante, y evita
      // conflictos entre dos referencias "local" pedidas de forma distinta).
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
    elArDebugAnchors.textContent =
      "[debug] anchors soportado: " + (anchorsSoportado ? "sí" : "no");

    ultimasDistancias = [];
    elArPromedio.style.display = "none";

    reiniciarMedicionActual();

    renderer.setAnimationLoop(renderizarFrame);
  }

  function configurarEscenaThreeJs() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera();

    const luz = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(luz);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    // El renderer se crea con alpha:true, pero eso solo permite que el
    // canvas TENGA transparencia -- Three.js igual lo limpia cada frame
    // con negro opaco por defecto. En una sesion immersive-ar el navegador
    // compone este canvas ENCIMA del video real de la camara usando el
    // canal alfa, asi que si no bajamos el alfa de limpieza a 0, el canvas
    // tapa completamente la camara real (pantalla negra).
    renderer.setClearColor(0x000000, 0);
    // Pixel ratio limitado a 2: en celulares con pantalla muy densa
    // (devicePixelRatio 3 o mas), renderizar sin tope aca sumado a la
    // sesion AR puede sobrecargar la GPU justo cuando arranca la camara,
    // llegando a colgar el dispositivo por completo.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    elArCanvasContainer.innerHTML = "";
    elArCanvasContainer.appendChild(renderer.domElement);

    // Reticulo: anillo que muestra donde se detecto una superficie real.
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

      // Estabilizacion: en vez de mover el reticulo a la posicion cruda
      // de este unico frame (que tiembla/rebota un poco), promediamos
      // las ultimas N lecturas.
      agregarMuestraReticulo(posicionCruda);
      reticle.visible = true;
      reticle.position.copy(calcularPosicionPromedioReticulo());
      reticle.quaternion.copy(rotacionCruda);

      if (puntos.length === 0) {
        elArInstruccion.textContent = "Apunta al primer punto y toca la pantalla";
      }
    } else {
      reticle.visible = false;
      bufferPosicionesReticulo = []; // se perdio la superficie: reiniciar el promedio

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
  // real, aunque ARCore ajuste su propio mapa del entorno mientras te
  // mueves.
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

    if (huboActualizacion && puntos.length === 2) {
      const distanciaMetros = puntos[0].distanceTo(puntos[1]);
      mostrarDistancia(distanciaMetros);
      dibujarLinea(puntos[0], puntos[1]);
    }
  }

  // --- 4. Al tocar la pantalla: marcar un punto ---
  async function alTocarPantalla(evento) {
    if (!reticle.visible) return;

    // Usamos la posicion YA estabilizada del reticulo (el promedio de
    // las ultimas lecturas), no la lectura cruda de un solo frame.
    const posicion = reticle.position.clone();

    let ancla = null;
    let motivoSinAncla = "";
    const frameDelEvento = evento && evento.frame ? evento.frame : null;

    if (!anchorsSoportado) {
      motivoSinAncla = "anchors no soportado";
    } else if (!frameDelEvento) {
      motivoSinAncla = "el evento select no trajo un frame";
    } else if (typeof frameDelEvento.createAnchor !== "function") {
      motivoSinAncla = "frame.createAnchor no existe";
    } else {
      try {
        const transform = new XRRigidTransform({
          x: posicion.x,
          y: posicion.y,
          z: posicion.z,
        });
        ancla = await frameDelEvento.createAnchor(transform, xrRefSpace);
      } catch (error) {
        motivoSinAncla = "error: " + error.message;
      }
    }

    elArDebugAnchors.textContent = ancla
      ? "[debug] punto " + (puntos.length + 1) + " anclado correctamente"
      : "[debug] punto " + (puntos.length + 1) + " SIN anclar (" + motivoSinAncla + ")";

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

    if (puntos.length === 1) {
      elArInstruccion.textContent = "Ahora apunta al segundo punto y toca la pantalla";
    } else if (puntos.length === 2) {
      const distanciaMetros = puntos[0].distanceTo(puntos[1]);
      mostrarDistancia(distanciaMetros);
      dibujarLinea(puntos[0], puntos[1]);
      guardarMedicionEnHistorial(distanciaMetros);

      // Promedio de mediciones repetidas: si el usuario mide la misma
      // distancia varias veces seguidas (tocando "Nueva medicion" y
      // volviendo a marcar 2 puntos), mostramos el promedio de las
      // ultimas N -- la misma practica que recomienda AR Ruler para
      // mejorar la confianza del resultado.
      ultimasDistancias.push(distanciaMetros);
      if (ultimasDistancias.length > TAMANIO_BUFFER_MEDICIONES_REPETIDAS) {
        ultimasDistancias.shift();
      }
      actualizarPromedioMostrado();
    }
  }

  function actualizarPromedioMostrado() {
    if (ultimasDistancias.length < 2) {
      elArPromedio.style.display = "none";
      return;
    }
    const suma = ultimasDistancias.reduce((acumulado, valor) => acumulado + valor, 0);
    const promedio = suma / ultimasDistancias.length;
    const texto =
      promedio < 1 ? `${(promedio * 100).toFixed(1)} cm` : `${promedio.toFixed(2)} m`;
    elArPromedio.textContent =
      `Promedio de ${ultimasDistancias.length} mediciones seguidas: ${texto}`;
    elArPromedio.style.display = "block";
  }

  function dibujarLinea(p1, p2) {
    if (lineaActual) {
      scene.remove(lineaActual);
    }
    const geometriaLinea = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const materialLinea = new THREE.LineBasicMaterial({ color: 0xffd60a, linewidth: 3 });
    lineaActual = new THREE.Line(geometriaLinea, materialLinea);
    scene.add(lineaActual);
  }

  function mostrarDistancia(distanciaMetros) {
    const texto =
      distanciaMetros < 1
        ? `${(distanciaMetros * 100).toFixed(1)} cm`
        : `${distanciaMetros.toFixed(2)} m`;
    elArDistancia.textContent = texto + " (aprox.)";
    elArDistancia.style.display = "block";
    elArInstruccion.textContent =
      "Medición lista. Repite estos 2 puntos para promediar, o toca \"Nueva medición\".";
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
    if (lineaActual) {
      scene.remove(lineaActual);
      lineaActual = null;
    }
    elArDistancia.style.display = "none";
    elArDistancia.textContent = "";
    elArInstruccion.textContent = reticle && reticle.visible
      ? "Apunta al primer punto y toca la pantalla"
      : "Buscando superficie… mueve el celular lentamente de lado a lado";
  }

  function deshacerUltimoPunto() {
    if (puntos.length === 0) return;
    puntos.pop();
    const ultimaAncla = anclas.pop();
    if (ultimaAncla && typeof ultimaAncla.delete === "function") {
      ultimaAncla.delete();
    }
    const ultimoMarcador = marcadores.pop();
    if (ultimoMarcador) scene.remove(ultimoMarcador);
    if (lineaActual) {
      scene.remove(lineaActual);
      lineaActual = null;
    }
    elArDistancia.style.display = "none";
    elArInstruccion.textContent =
      puntos.length === 0
        ? "Apunta al primer punto y toca la pantalla"
        : "Ahora apunta al segundo punto y toca la pantalla";
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
    ultimasDistancias = [];
    elArPromedio.style.display = "none";
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
    historial = historial.slice(0, 20); // Guardar solo las ultimas 20
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    renderizarHistorial();
  }

  // Borra una sola medicion del historial, identificada por su posicion
  // (indice) en la lista actual.
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

      const texto =
        item.valor < 1
          ? `${(item.valor * 100).toFixed(1)} cm`
          : `${item.valor.toFixed(2)} m`;

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
