
import {Stripe} from "stripe"

export interface LiaisonOptions {
	stripe: Stripe
	returningLinks: {
		accounting: {
			refresh: string
			return: string
		},
		checkouts: {
			cancel: string
			success: string
		},
	}
}
