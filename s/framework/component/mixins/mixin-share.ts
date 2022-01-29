
import {Mixin} from "../../../types/mixin.js"
import {Constructor} from "../../../types/constructor.js"

export interface WithShare<xShare> {
	get share(): xShare
}

export function mixinShare<xShare>(providedShare: xShare) {
	return function<C extends Constructor>(
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
	return function<C extends Constructor>(
			Base: C
		): Mixin<C, WithShare<xShare>> {

		return <any>class extends Base {
			get share(): xShare {
				throw new Error(`share required by component${name ? " " + name : ""}`)
			}
		}
	}
}
