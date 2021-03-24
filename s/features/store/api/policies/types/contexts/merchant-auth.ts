
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {AppOwnerAuth} from "../../../../../auth/policies/types/app-owner-auth.js"
import {PlatformStripeLiaison} from "../../../../stripe2/types/platform-stripe-liaison.js"

export type MerchantAuth = {
	platformStripeLiaison: PlatformStripeLiaison
	getTablesNamespacedForApp: (appId: string) => Promise<StoreAuthSpecifics["tables"]>
} & StoreAuthSpecifics & AppOwnerAuth
