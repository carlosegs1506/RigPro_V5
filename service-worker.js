// Service Worker de RigPro
//
// Estrategia: "network falling back to cache" + cacheo progresivo.
// No se listan a mano las 90+ paginas del proyecto (seria fragil de
// mantener); en su lugar, cada pagina que el usuario visita con conexion
// se va guardando automaticamente, y queda disponible offline la proxima
// vez. Esto tambien cumple el requisito minimo de instalabilidad que pide
// PWABuilder (un Service Worker registrado con un manejador de "fetch").

const CACHE_NAME = "rigpro-cache-v1";

// App shell minimo: lo esencial para que la app abra aunque no haya
// conexion la primera vez.
const APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./assest/css/style.css",
  "./assest/icons/icon-192.png",
  "./assest/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Solo cacheamos peticiones GET; dejamos pasar todo lo demas (POST, etc.)
  if (event.request.method !== "GET") return;

  // Las peticiones a otros dominios (fuentes de Google, etc.) se dejan
  // pasar directo a la red sin interceptar.
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((respuestaRed) => {
        const copia = respuestaRed.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return respuestaRed;
      })
      .catch(() => caches.match(event.request))
  );
});
