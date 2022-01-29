
import {Mixin} from "../../../types/mixin.js"
import {ConstructorFor} from "../../../types/constructor-for.js"

export interface WithShare<xShare> {
	get share(): xShare
}

export function mixinShare<xShare>(providedShare: xShare) {
	return function<C extends ConstructorFor>(
			Base: C
		): Mixin<C, WithShare<xShare>> {

		return <any>class extends Base {
			get share() {
				return providedShare
			}
		}
	}
}

export function mixinRequireShare<xShare>(name?: string) {
	return function<C extends ConstructorFor>(
			Base: C
		): Mixin<C, WithShare<xShare>> {

		return <any>class extends Base {
			get share(): xShare {
				throw new Error(`share required by component${name ? " " + name : ""}`)
			}
		}
	}
}
