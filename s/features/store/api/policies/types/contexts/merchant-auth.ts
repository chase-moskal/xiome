
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {AppOwnerAuth} from "../../../../../auth/policies/types/app-owner-auth.js"
import {StripeAccounting} from "../../../../stripe/parts/accounts/types/stripe-accounting.js"

export type MerchantAuth = {
	stripeAccounting: StripeAccounting
	getTablesNamespacedForApp: (appId: string) => Promise<StoreAuthSpecifics["tables"]>
} & StoreAuthSpecifics & AppOwnerAuth
