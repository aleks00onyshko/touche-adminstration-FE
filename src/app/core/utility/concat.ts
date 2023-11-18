export type Concat<T extends string[]> = T extends [
    infer F extends string,
    ...infer R extends string[]
] ? `${F}${Concat<R>}` : '';