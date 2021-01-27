
import {ConstructorFor} from "../../types.js"

export type Share = any

export const share2 = <S extends {}, C extends ConstructorFor<{}>>(
		Constructor: C,
		object: S
	) => class extends Constructor {

	get share() {
		return object
	}
}

export type WithShare<S extends Share, T extends {}> = T & ConstructorFor<{
	readonly share: S
}>
