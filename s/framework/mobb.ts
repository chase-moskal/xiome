
import * as mobx from "mobx"
import {objectMap} from "../toolbox/object-map.js"

export * from "mobx"
// import {action, computed, observable} from "mobx"

export const actions =
	<T extends {}>(o: T): T =>
		objectMap(o, v => <any>mobx.action.bound(v))

export const computeds =
	<T extends {}>(o: T): T =>
		objectMap(o, v => <any>mobx.computed(v))

export const observables =
	<T extends {}>(o: T): T =>
		objectMap(o, v => mobx.observable(v))

// export const mobxActions =
// 	<T extends {}>(input: T): T => {
// 		const object = {...input}
// 		Object.entries(object).forEach(([key, value]) => {
// 			action.bound(object, key, value)
// 		})
// 		return object
// 	}
