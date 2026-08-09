// medidorCamara.js
//
// Medidor de distancias con camara usando WebXR Device API (hit-test) +
// Three.js. Solo funciona en navegadores/contextos que soporten
// "immersive-ar" con la feature "hit-test" -- en la practica, Chrome en
// Android con ARCore. Dentro de RigPro empaquetado como TWA, esto corre
// sobre el Chrome real del sistema, asi que deberia funcionar igual que en
// el navegador.
//
// Flujo:
// 1. Al cargar la pagina, se revisa si el navegador soporta AR.
// 2. Si soporta, se habilita el boton "Iniciar medicion AR".
// 3. Al entrar en AR, se muestra un reticulo (anillo) que sigue las
//    superficies reales detectadas.
// 4. El usuario toca la pantalla para marcar el primer punto, apunta a
//    otro lugar y toca de nuevo para el segundo punto.
// 5. Se calcula la distancia euclidiana 3D entre ambos puntos y se
//    muestra en metros/centimetros.

(function () {
  const CLAVE_HISTORIAL = "rigpro_medidor_historial";

  let renderer, scene, camera, reticle, xrSession, hitTestSource, xrRefSpace;
  let puntos = []; // Vector3[] de los puntos marcados en la medicion actual
  let marcadores = []; // Mesh[] de las esferas que marcan cada punto
  let lineaActual = null; // Mesh de la linea entre los 2 puntos

  const elMensajeCompatibilidad = document.getElementById("mensajeCompatibilidad");
  const elBtnIniciarAR = document.getElementById("btnIniciarAR");
  const elArOverlay = document.getElementById("arOverlay");
  const elArCanvasContainer = document.getElementById("arCanvasContainer");
  const elArInstruccion = document.getElementById("arInstruccion");
  const elArDistancia = document.getElementById("arDistancia");
  const elBtnNuevaMedicion = document.getElementById("btnNuevaMedicion");
  const elBtnSalirAR = document.getElementById("btnSalirAR");
  const elBtnDeshacerPunto = document.getElementById("btnDeshacerPunto");
  const elListaMediciones = document.getElementById("listaMediciones");
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
        optionalFeatures: ["dom-overlay"],
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

    reiniciarMedicionActual();

    renderer.setAnimationLoop(renderizarFrame);
  }

  function configurarEscenaThreeJs() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera();

    const luz = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(luz);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    // FIX: por defecto Three.js limpia el canvas cada frame con negro
    // OPACO (alpha 1), aunque el renderer se haya creado con alpha:true.
    // En una sesion immersive-ar el navegador compone este canvas ENCIMA
    // del video real de la camara usando el canal alfa: donde el canvas
    // tiene alfa 1 tapa la camara, donde tiene alfa 0 se ve el mundo real.
    // Sin esta linea, cada frame se limpiaba a negro opaco y tapaba
    // completamente el feed de la camara (pantalla negra), aunque la
    // sesion AR ya estuviera corriendo bien.
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

    // Reticulo: anillo que muestra donde se detecto una superficie real
    const geometriaReticulo = new THREE.RingGeometry(0.05, 0.06, 32).rotateX(
      -Math.PI / 2
    );
    const materialReticulo = new THREE.MeshBasicMaterial({ color: 0xffd60a });
    reticle = new THREE.Mesh(geometriaReticulo, materialReticulo);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
  }

  // --- 3. Loop de renderizado: actualiza el reticulo segun el hit-test ---
  function renderizarFrame(timestamp, frame) {
    if (!frame) return;

    const results = frame.getHitTestResults(hitTestSource);

    if (results.length > 0) {
      const hit = results[0];
      const pose = hit.getPose(xrRefSpace);
      reticle.visible = true;
      reticle.matrix.fromArray(pose.transform.matrix);
    } else {
      reticle.visible = false;
    }

    renderer.render(scene, camera);
  }

  // --- 4. Al tocar la pantalla: marcar un punto ---
  function alTocarPantalla() {
    if (!reticle.visible) return; // No hay superficie detectada ahi todavia

    const posicion = new THREE.Vector3();
    posicion.setFromMatrixPosition(reticle.matrix);

    agregarPunto(posicion);
  }

  function agregarPunto(posicion) {
    puntos.push(posicion.clone());

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
    }
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
    elArInstruccion.textContent = "Medición lista. Toca \"Nueva medición\" para otra.";
  }

  // --- 5. Controles de la sesion ---
  function reiniciarMedicionActual() {
    puntos = [];
    marcadores.forEach((m) => scene.remove(m));
    marcadores = [];
    if (lineaActual) {
      scene.remove(lineaActual);
      lineaActual = null;
    }
    elArDistancia.style.display = "none";
    elArDistancia.textContent = "";
    elArInstruccion.textContent = "Apunta al primer punto y toca la pantalla";
  }

  function deshacerUltimoPunto() {
    if (puntos.length === 0) return;
    puntos.pop();
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
    elBtnIniciarAR.disabled = false;
    elBtnIniciarAR.textContent = "Iniciar medición AR";
  }

  // --- 6. Historial de mediciones (guardado local en el dispositivo) ---
  function guardarMedicionEnHistorial(distanciaMetros) {
    let historial = [];
    try {
      historial = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];
    } catch (e) {
      historial = [];
    }
    historial.unshift({
      valor: distanciaMetros,
      fecha: new Date().toLocaleString("es-CL"),
    });
    historial = historial.slice(0, 20); // Guardar solo las ultimas 20
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    renderizarHistorial();
  }

  function renderizarHistorial() {
    let historial = [];
    try {
      historial = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];
    } catch (e) {
      historial = [];
    }

    elListaMediciones.innerHTML = "";

    if (historial.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Todavía no has hecho ninguna medición.";
      elListaMediciones.appendChild(li);
      return;
    }

    historial.forEach((item) => {
      const li = document.createElement("li");
      const texto =
        item.valor < 1
          ? `${(item.valor * 100).toFixed(1)} cm`
          : `${item.valor.toFixed(2)} m`;
      li.textContent = `${texto} — ${item.fecha}`;
      elListaMediciones.appendChild(li);
    });
  }

  // --- Eventos de los botones ---
  elBtnIniciarAR.addEventListener("click", iniciarAR);
  elBtnNuevaMedicion.addEventListener("click", reiniciarMedicionActual);
  elBtnSalirAR.addEventListener("click", salirDeAR);
  elBtnDeshacerPunto.addEventListener("click", deshacerUltimoPunto);

  window.addEventListener("resize", () => {
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });

  // --- Arranque ---
  comprobarCompatibilidad();
  renderizarHistorial();
})();