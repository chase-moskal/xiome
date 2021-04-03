
import {Loading} from "../../../../../framework/loading/types/loading.js"
import {SubscriptionPlan} from "../../../topics/types/subscription-plan.js"

export namespace PlanningSituation {
	export enum Mode {
		StoreUninitialized,
		LoggedOut,
		Unprivileged,
		Privileged,
	}

	export interface Base {
		mode: Mode
	}

	export interface StoreUninitialized {
		mode: Mode.StoreUninitialized
	}

	export interface LoggedOut {
		mode: Mode.LoggedOut
	}

	export interface Unprivileged {
		mode: Mode.Unprivileged
	}

	export interface Privileged {
		mode: Mode.Privileged
		loadingPlanCreation: Loading<void>
		loadingPlans: Loading<SubscriptionPlan[]>
	}

	export type Any = StoreUninitialized | LoggedOut | Unprivileged | Privileged
}
