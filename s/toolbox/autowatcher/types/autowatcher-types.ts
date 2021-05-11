
import {autowatcher} from "../autowatcher.js"

export type Watcher<X> = () => X
export type Action = (...args: any[]) => any
export type Effect<X> = (observation: X) => void

export type Stakeout<X> = {
	watcher: Watcher<X>
	effect?: Effect<X>
}

export type Track<X> = (stakeout: Stakeout<X>) => () => void

export interface ObservableRecord {
	[key: string]: Stakeout<any>[]
}

export interface Actions {
	[key: string]: Action
}

export interface ScheduledObservable {
	object: {}
	key: string
	stakeout: Stakeout<any>
}

export interface Context {
	observableRecords: Map<{}, ObservableRecord>
	newObservablesSchedule: ScheduledObservable[]
	activeAction: Action
	activeStakeout: Stakeout<any>
}

export type Autowatcher = ReturnType<typeof autowatcher>
