
import {CardClues} from "./card-clues.js"

export interface PaymentDetails {
	card: CardClues
	stripePaymentMethodId: string
}
