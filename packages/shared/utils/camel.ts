type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
  : S

type CamelCase<T> =
  T extends Array<infer Item>
    ? Array<CamelCase<Item>>
    : T extends object
      ? { [K in keyof T as SnakeToCamel<string & K>]: CamelCase<T[K]> }
      : T

const toCamel = (s: string): string => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

export const camelCase = <T>(obj: T): CamelCase<T> => {
  if (Array.isArray(obj)) {return obj.map(camelCase) as CamelCase<T>}

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toCamel(k), camelCase(v)])) as CamelCase<T>
  }

  return obj as CamelCase<T>
}
