/**
 * Transforma un Map genérico en un arreglo con todos sus valores
 * @param map - El Map a transformar
 * @returns Un arreglo con todos los valores del Map
 */
export function mapToArray<T>(map: Map<any, T>): T[] {
    return Array.from(map.values())
  }
  
  /**
   * Transforma un Map genérico en un arreglo con todas sus entradas (key-value pairs)
   * @param map - El Map a transformar
   * @returns Un arreglo con todas las entradas del Map como tuplas [key, value]
   */
  export function mapToEntries<K, V>(map: Map<K, V>): [K, V][] {
    return Array.from(map.entries())
  }
  
  /**
   * Transforma un Map genérico en un arreglo con todas sus claves
   * @param map - El Map a transformar
   * @returns Un arreglo con todas las claves del Map
   */
  export function mapToKeys<K>(map: Map<K, any>): K[] {
    return Array.from(map.keys())
  }