
export * from "mobx"
import {action, computed, observable} from "mobx"
import {objectMap} from "../toolbox/object-map.js"

export type Amend<T extends {}> = {[K in keyof T]: T[K]}

export const actionelize =
	<T extends {}>(o: T): Amend<T> =>
		objectMap(o, v => action(v))

export const computelize =
	<T extends {}>(o: T): Amend<T> =>
		objectMap(o, v => <any>computed(v))

export const observelize =
	<T extends {}>(o: T): Amend<T> =>
		objectMap(o, v => observable(v))
