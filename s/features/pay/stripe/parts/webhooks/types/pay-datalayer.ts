
import {UserHasRoleRow} from "../../../../../auth/auth-types.js"
import {StripePremiumRow} from "../../../../api/tables/types/rows/stripe-premium-row.js"
import {StripeCustomerRow} from "../../../../api/tables/types/rows/stripe-customer-row.js"

export interface PayDatalayer {
	getUserHasPremiumRole: (userId: string) => Promise<UserHasRoleRow>
	getStripeCustomerByCustomerId: (stripeCustomerId: string) => Promise<StripeCustomerRow>
	upsertStripePremiumRow: (row: StripePremiumRow) => Promise<void>
	deleteStripePremiumRow: (userId: string) => Promise<void>
	getStripePremiumRow: (userId: string) => Promise<StripePremiumRow>
	grantPremiumRoleUntil: (userId: string, timeframeEnd: number) => Promise<void>
}
