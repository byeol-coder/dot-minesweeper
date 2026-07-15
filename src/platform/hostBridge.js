const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.tactileworlds.com",
  "https://tactileworlds.com",
  "https://tw-app-ten.vercel.app"
];

export function createHostBridge({ gameId, embedded, allowedOrigins = DEFAULT_ALLOWED_ORIGINS }) {
  let parentOrigin = "*";
  const listeners = new Set();

  function post(type, payload = {}) {
    if (!embedded || window.parent === window) return;
    window.parent.postMessage({ source: "dotarcade", gameId, type, ...payload }, parentOrigin);
  }

  function onMessage(event) {
    if (event.source !== window.parent) return;
    if (allowedOrigins.includes(event.origin)) parentOrigin = event.origin;
    if (event.origin !== "null" && !allowedOrigins.includes(event.origin)) return;
    listeners.forEach(listener => listener(event.data || {}));
  }

  window.addEventListener("message", onMessage);

  return {
    post,
    ready: () => post("ready"),
    resize: height => post("resize", { height }),
    exit: () => post("exit"),
    complete: payload => post("game-complete", payload),
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    destroy() { listeners.clear(); window.removeEventListener("message", onMessage); }
  };
}
