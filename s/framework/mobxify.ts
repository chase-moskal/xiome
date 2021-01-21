
import {makeAutoObservable} from "mobx"

export function mobxify<T extends {[key: string]: any}>(ooo: T): T {

	for (const key in ooo)
		if (typeof ooo[key] === "function")
			ooo[key] = ooo[key].bind(ooo)

	return makeAutoObservable(ooo)
}
