
import {LitElement} from "lit-element"
import {ConstructorFor} from "../types.js"
import {autorun, IReactionDisposer, IReactionPublic} from "mobx"

const _autorunClear = Symbol("_autorunClear")
const _autorunDisposers = Symbol("_autorunDisposers")
const _autorunInitialize = Symbol("_autorunInitialize")

type MixinIn = ConstructorFor<LitElement>
type MixinOut<C extends MixinIn> = C & ConstructorFor<{autorun: () => void}>

export function mixinMobxAutorun<C extends MixinIn>(Constructor: C): MixinOut<C> {
	return class LitElementWithMobxAutorun extends Constructor {

		autorun() {}
		autoruns: IReactionPublic[] = []

		connectedCallback() {
			this[_autorunInitialize]()
			super.connectedCallback()
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			this[_autorunClear]()
		}

		private [_autorunDisposers]: IReactionDisposer[] = []

		private [_autorunClear]() {
			for (const dispose of this[_autorunDisposers]) {
				dispose()
			}
			this[_autorunDisposers] = []
		}

		private [_autorunInitialize]() {
			this[_autorunClear]()
			this[_autorunDisposers] = [
				autorun(() => this.autorun()),
				...this.autoruns.map(run => autorun(() => run)),
			]
		}
	}
}
