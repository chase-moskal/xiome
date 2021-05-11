
import {ScheduledObservable} from "../types/autowatcher-types.js"

export class AutowatcherCircularError extends Error {
	constructor(scheduled: ScheduledObservable) {
		super(`an effect changes an observable, named "${scheduled.key}", that triggers that same effect, causing an infinite circle`)
	}
}

export class AutowatcherLeakError extends Error {
	constructor(key: string) {
		super(`cannot set observable, named "${key}", outside a formalized action`)
	}
}
