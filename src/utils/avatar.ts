// Resuelve la URL final del avatar a partir de un nombre o una URL
export function resolveAvatarUrl(src?: string) {
  if (!src) return undefined

  // Si ya viene una URL válida, úsala tal cual
  if (/^https?:\/\//i.test(src) || /^(\/assets\/|blob:|data:)/i.test(src)) return src

  // Si viene solo el nombre (p. ej. "Avatar3.png"), resolver con Vite
  try {
    return new URL(`../assets/profile_images/${src}`, import.meta.url).href
  } catch {
    return undefined
  }
}
