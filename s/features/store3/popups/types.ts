
import {Id} from "dbmage"
import {mockStripePopups} from "./mock-stripe-popups.js"

export type StripePopups = ReturnType<typeof mockStripePopups>

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

	export interface Result<xDetails = void> {
		popupId: string
		details?: xDetails
	}
}
