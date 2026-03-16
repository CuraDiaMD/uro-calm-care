// Deep type that converts all leaf string literals to `string`
type DeepStringify<T> = T extends readonly (infer U)[]
  ? DeepStringify<U>[]
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : T extends string
  ? string
  : T extends number
  ? number
  : T;

export type TranslationSchema = DeepStringify<typeof import('./en').en>;
