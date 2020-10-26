
export type AnyListener = (...args: any) => void | Promise<void>

export interface Unsubscribe {
	(): void
}

export interface Subscribe<Listener extends AnyListener = AnyListener> {
	(func: Listener): Unsubscribe
}

export interface Pubsub<Listener extends AnyListener = AnyListener> {
	publish: Listener
	dispose: () => void
	subscribe: Subscribe<Listener>
}

export interface AnyPubsubsInput {
	[key: string]: AnyListener
}

export type Pubsubs<O extends AnyPubsubsInput = AnyPubsubsInput> = {
	[K in keyof O]: Pubsub<O[K]>
}

export type Pubify<P extends Pubsubs> = {
	[K in keyof P]: P[K]["publish"]
}

export type Subify<P extends Pubsubs> = {
	[K in keyof P]: P[K]["subscribe"]
}

export interface Reader<S extends {} = {}> {
	state: Readonly<S>
	subscribe: Subscribe<(state: S) => void>
}

export interface ReaderContext<S extends {} = {}> {
	reader: Reader<S>
	update: () => void
}

/**
 * create a pub/sub context
 */
export function pubsub<Listener extends AnyListener = AnyListener>():
		Pubsub<Listener> {
	let listeners: Listener[] = []
	return {
		publish: <Listener>(async(...args: any) => {
			const operations = listeners.map(listener => listener(...args))
			await Promise.all(operations)
		}),
		subscribe(func: Listener): Unsubscribe {
			listeners.push(func)
			return () => {
				listeners = listeners.filter(listener => listener !== func)
			}
		},
		dispose: () => {
			listeners = []
		},
	}
}

/**
 * create a separated group of publish and subscribe functions
 */
export function pubsubs<O extends AnyPubsubsInput>(obj: Pubsubs<O>): {
	publishers: Pubify<Pubsubs<O>>
	subscribers: Subify<Pubsubs<O>>
} {
	const publishers: any = {}
	const subscribers: any = {}
	for (const [key, original] of Object.entries(obj)) {
		publishers[key] = original.publish
		subscribers[key] = original.subscribe
	}
	return {publishers, subscribers}
}

/**
 * make a state reader
 */
export function makeReader<S extends {} = {}>(state: S): ReaderContext<S> {
	const {publish, subscribe} = pubsub<(state: S) => void>()
	return {
		reader: {
			subscribe,
			get state() {return Object.freeze({...state})},
		},
		update: () => publish(Object.freeze({...state})),
	}
}
