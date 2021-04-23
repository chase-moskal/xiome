
import {Op} from "../../../../../framework/ops.js"
import {SubscriptionPlan} from "../../../topics/types/subscription-plan.js"

export namespace PlanningSituation {
	export enum Mode {
		LoggedOut,
		Unprivileged,
		Privileged,
	}

	export interface Base {
		mode: Mode
	}

	export interface LoggedOut {
		mode: Mode.LoggedOut
	}

	export interface Unprivileged {
		mode: Mode.Unprivileged
	}

	export interface Privileged {
		mode: Mode.Privileged
		planCreation: Op<undefined>
		plans: Op<SubscriptionPlan[]>
	}

	export type Any = LoggedOut | Unprivileged | Privileged
}
