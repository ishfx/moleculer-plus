export function cleanRoutePath(str: string): string {
  return str.replace(/[^a-zA-Z0-9-/]/g, '');
}

export function deepClone<T extends any>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Set) {
    const clonedSet = new Set();
    obj.forEach((value) => clonedSet.add(deepClone(value)));
    return clonedSet as T;
  }

  if (obj instanceof Map) {
    const clonedMap = new Map();
    obj.forEach((value, key) => clonedMap.set(key, deepClone(value)));
    return clonedMap as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as T;
  }

  const clone = Array.isArray(obj) ? [] : {};
  Object.entries(obj).forEach(([key, value]) => (clone[key] = deepClone(value)));

  return clone as T;
}
