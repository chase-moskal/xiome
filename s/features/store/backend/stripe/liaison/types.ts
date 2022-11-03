
import {makeStripeLiaison} from "./stripe-liaison.js"

export type StripeLiaison = ReturnType<typeof makeStripeLiaison>
export type StripeLiaisonAccount = ReturnType<StripeLiaison["account"]>

export type CardClues = {
	brand: string
	last4: string
	country: string
	expireYear: number
	expireMonth: number
}
