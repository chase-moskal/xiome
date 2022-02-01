
import {subbies} from "../subbies.js"
import {objectMap} from "../object-map.js"
import {debounce} from "../debounce/debounce.js"
import {debounceDelay} from "./parts/constants.js"
import {plantProperty} from "../plant-property.js"
import {SnapstateReadonlyError} from "./parts/errors.js"
import {Observer, Reaction, Readable} from "./parts/types.js"
import {trackingMechanics} from "./parts/tracking-mechanics.js"

export function snapstate<xState extends {}>(actual: xState) {
	const tracking = trackingMechanics()

	function get(t: any, key: string) {
		tracking.reactionRegistration(key)
		return actual[key]
	}

	const readable: Readable<xState> = new Proxy(actual, {
		get,
		set(t, key: string) {
			throw new SnapstateReadonlyError(`readonly state property "${key}"`)
		},
	})

	const {publish: rawPublish, subscribe} = subbies<Readable<xState>>()
	const publishReadable = debounce(debounceDelay, () => rawPublish(readable))

	let waiter: Promise<void> = Promise.resolve()

	const writable: xState = new Proxy(actual, {
		get,
		set(t, key: string, value) {
			tracking.avoidCircular(key)
			actual[key] = value
			tracking.triggerReactions(readable, key)
			waiter = publishReadable()
			return true
		},
	})

	return {
		readable,
		writable,
		subscribe,
		track<X>(observer: Observer<xState, X>, reaction?: Reaction<X>) {
			return tracking.track(readable, observer, reaction)
		},
		async wait() {
			await Promise.all([waiter, tracking.wait])
		},
	}
}

export interface SnapstateTree {
	[key: string]: SnapstateTree | ReturnType<typeof snapstate>
}

export type ReadableTree<xTree extends SnapstateTree> = {
	[P in keyof xTree]: xTree[P] extends ReturnType<typeof snapstate>
		? xTree[P]["readable"]
		: xTree[P] extends SnapstateTree
			? ReadableTree<xTree[P]>
			: never
}

export type WritableTree<xTree extends SnapstateTree> = {
	[P in keyof xTree]: xTree[P] extends ReturnType<typeof snapstate>
		? xTree[P]["writable"]
		: xTree[P] extends SnapstateTree
			? WritableTree<xTree[P]>
			: never
}

function isSnapstate(x: any) {
	return !!x.readable
}

export function composeSnapstate<xTree extends SnapstateTree>(tree: xTree) {
	const snapstates: ReturnType<typeof snapstate>[] = []
	const readable = <ReadableTree<xTree>>{}
	const writable = <WritableTree<xTree>>{}

	function recurse(
			value: ReturnType<typeof snapstate> | SnapstateTree,
			path: string[],
		) {
		objectMap(value, (innerValue, key) => {
			const currentPath = [...path, key]
			if (isSnapstate(innerValue)) {
				snapstates.push(innerValue)
				plantProperty(readable, currentPath, innerValue.readable)
				plantProperty(writable, currentPath, innerValue.writable)
			}
			else if (typeof innerValue === "object")
				recurse(innerValue, currentPath)
			else
				throw new Error(
					`invalid value in snapstate tree, "${currentPath.join(".")}"`
				)
		})
	}

	recurse(tree, [])

	type ListeningAspects = Pick<
		ReturnType<typeof snapstate>,
		"subscribe" | "track" | "wait"
	>

	return {
		tree,
		readable,
		writable,
		...<ListeningAspects>{
			subscribe(listener) {
				const unsubs = snapstates.map(s => s.subscribe(listener))
				return () => {
					for (const unsub of unsubs)
						unsub()
				}
			},
			track(observer, reaction) {
				const untracks = snapstates.map(s => s.track(observer, reaction))
				return () => {
					for (const untrack of untracks)
						untrack()
				}
			},
			async wait() {
				await Promise.all(snapstates.map(s => s.wait()))
			},
		},
	}
}
