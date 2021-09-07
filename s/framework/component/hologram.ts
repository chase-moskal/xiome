
import {madstate} from "../../toolbox/madstate/madstate.js"
import {Readable} from "../../toolbox/madstate/parts/types.js"

export type Type =
	| typeof String
	| typeof Boolean
	| typeof Number
	| typeof Object

export type ToType<T> =
	T extends string ? typeof String
	: T extends boolean ? typeof Boolean
	: T extends number ? typeof Number
	: T extends {} ? typeof Object
	: never

export function property<T>(type: ToType<T>) {
	return <T><any>type
}

export type Properties = {[key: string]: any}

export function hologramComponent<Required extends Properties, Optional extends Properties>({}: {
		required: Required
		optional: Optional
		init({}: ReturnType<typeof madstate>): void
		render(readable: Readable<Required & Partial<Optional>>): any
	}) {

	type State = Required & Partial<Optional>
	const state = madstate<State>(<any>{})

	const Component = class extends HTMLElement {}

	function virtual(state: State) {

	}

	virtual.Component = Component

	return virtual
}

//
//
// playing around
//
//

const test = hologramComponent({
	required: {
		haha: property<string>(String),
		lmao: property<boolean>(Boolean),
	},
	optional: {
		rofl: property<{x: number}>(Object),
	},
	init({readable, writable}) {

	},
	render: state => `
		${state.haha}
	`,
})

test({
	haha: ":)",
	lmao: true,
	rofl: {x: 1},
})
