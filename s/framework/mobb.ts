
export * from "mobx"
import {action, computed, observable} from "mobx"

import {objectMap} from "../toolbox/object-map.js"

export const actions =
	<T extends {}>(o: T): T =>
		objectMap(o, v => <any>action.bound(v))

export const computeds =
	<T extends {}>(o: T): T =>
		objectMap(o, v => <any>computed(v))

export const observables =
	<T extends {}>(o: T): T =>
		objectMap(o, v => observable(v))
