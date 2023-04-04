export function stringOrNull(str: unknown) {
  if (typeof str === 'string') {
    return str
  }
  return null
}
