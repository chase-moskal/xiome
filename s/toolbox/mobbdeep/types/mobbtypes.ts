
export type Watcher = () => void
export type Action = (...args: any[]) => any

export interface Record {
	[key: string]: Watcher[]
}

export interface Actions {
	[key: string]: Action
}

export interface Subscription {
	object: {}
	key: string
	watcher: Watcher
}

export interface MobbState {
	records: Map<{}, Record>
	watcherSchedule: Subscription[]
	activeAction: Action
	activeWatcher: Watcher
}
