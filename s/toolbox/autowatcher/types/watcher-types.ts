
export type Observer = () => void
export type Effect = () => void
export type Action = (...args: any[]) => any

export interface Record {
	[key: string]: Effect[]
}

export interface Actions {
	[key: string]: Action
}

export interface Subscription {
	object: {}
	key: string
	effect: Effect
}

export interface State {
	records: Map<{}, Record>
	schedule: Subscription[]
	activeAction: Action
	activeEffect: Effect
}
