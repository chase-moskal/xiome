
import {PayAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {AppOwnerAuth} from "../../../../../auth/policies/types/app-owner-auth.js"

export type MerchantAuth = {
	getTablesNamespacedForApp: (appId: string) => Promise<PayAuthSpecifics["tables"]>
} & PayAuthSpecifics & AppOwnerAuth
