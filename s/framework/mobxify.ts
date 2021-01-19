
import {makeAutoObservable} from "mobx"
import {objectMap} from "../toolbox/object-map.js"

export function mobxify<T extends {[key: string]: any}>(ooo: T): T {
	return makeAutoObservable(
		objectMap(ooo, value =>
			typeof value === "function"
				? value.bind(ooo)
				: value
		)
	)
}
