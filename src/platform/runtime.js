export function readRuntime(search = window.location.search) {
  const params = new URLSearchParams(search);
  return Object.freeze({
    embedded: params.get("embed") === "1",
    previewOff: params.get("preview") === "0",
    language: params.get("lang") === "en" ? "en" : "ko"
  });
}
