
import {ConstructorFor} from "../../types/constructor-for.js"
import {Component, WiredComponent} from "../component.js"

export type Share = any

export const share2 = <S extends {}, C extends ConstructorFor<WiredComponent<S>>>(
		Constructor: C,
		object: S
	) => <ConstructorFor<WiredComponent<S>>>class extends (<any>Constructor) {

	get share() {
		return object
	}
}

export type WithShare<S extends Share, T extends {}> = T & ConstructorFor<{
	readonly share: S
}>
