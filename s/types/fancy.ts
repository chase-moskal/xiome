
export type ConstructorFor<T extends {} = {}> = new(...args: any[]) => T

export type Await<T> = T extends Promise<infer U> ? U : T
