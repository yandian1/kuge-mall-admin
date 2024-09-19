export function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export function peerCopy(source: Recordable, target: Recordable) {
  for (const key in target) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  }
}
