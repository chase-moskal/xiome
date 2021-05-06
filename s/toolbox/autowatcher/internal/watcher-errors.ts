
import {Subscription} from "../types/watcher-types.js"

export class AutowatcherCircularError extends Error {
	constructor(subscription: Subscription) {
		super(`an effect has set an observable it's tracking, named "${subscription.key}", causing an infinite circle`)
	}
}

export class AutowatcherLeakError extends Error {
	constructor(key: string) {
		super(`cannot set observable, named "${key}", outside a formalized action`)
	}
}
