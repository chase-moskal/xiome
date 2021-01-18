
import {makeObservable} from "mobx"
import {ConstructorFor} from "../types.js"

type MixinIn = ConstructorFor<any>

export function mixinModelMobx<C extends MixinIn>(Constructor: C): C {
	return class Observable extends Constructor {
		constructor(...args: any[]) {
			super(...args)
			makeObservable(this)
		}
	}
}
