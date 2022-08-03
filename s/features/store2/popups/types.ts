
import {Id} from "dbmage"
import {mockStripePopups} from "./mock-stripe-popups.js"

export type StripePopups = ReturnType<typeof mockStripePopups>

/*
StripePopups
	- makeStripePopups -- actual production code, really makes actual stripe poups
	- mockStripePopups -- triggers our fake popups that pretend to be stripe
	- riggedStripePopups -- cynic tests (no actual popups are created)
*/


export namespace Popups {
	export interface SpecParams {
		popupReturnUrl: string
		generateId: () => Id
	}

	export interface SecretMockCommand {
		secretMockCommand: true
		commandId: number
		type: string
	}

	export interface SecretMockResponse {
		secretMockCommand: true
		commandId: number
	}

	export interface Parameters {
		url: string
		popupId: string
		width?: number
		height?: number
		handleSecretMockCommand?(command: SecretMockCommand): Promise<void>,
	}

	export interface Result {
		popupId: string
	}
}
