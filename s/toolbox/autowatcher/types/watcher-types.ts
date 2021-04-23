
export type Observer = () => void
export type Action = (...args: any[]) => any

export interface Record {
	[key: string]: Observer[]
}

export interface Actions {
	[key: string]: Action
}

export interface Subscription {
	object: {}
	key: string
	observer: Observer
}

export interface State {
	records: Map<{}, Record>
	schedule: Subscription[]
	activeAction: Action
	activeObserver: Observer
}
