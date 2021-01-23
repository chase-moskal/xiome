
import {makeAutoObservable} from "mobx"
import {bindMethods} from "../toolbox/bind-methods.js"

export function mobxify<T extends {[key: string]: any}>(obj: T): T {
	bindMethods(obj)
	return makeAutoObservable(obj)
}
