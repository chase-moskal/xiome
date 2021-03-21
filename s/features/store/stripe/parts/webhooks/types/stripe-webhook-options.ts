
import {Logger} from "../../../../../../toolbox/logger/interfaces.js"
import {StoreTables} from "../../../../api/tables/types/store-tables.js"
import {AuthTables} from "../../../../../auth/tables/types/auth-tables.js"
import {StripeSubscriptions} from "../../subscriptions/types/stripe-subscriptions.js"

export interface StripeWebhookOptions {
	logger: Logger
	tables: StoreTables & AuthTables
	subscriptions: StripeSubscriptions
}
