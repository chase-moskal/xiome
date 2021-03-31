
import {Stripe} from "stripe"
import {StoreTables} from "../../api/tables/types/store-tables.js"
import {StoreStatus} from "../types/store-status.js"

export async function determineStoreStatus({
		tables,
		account,
	}: {
		tables: StoreTables
		account: undefined | Stripe.Account
	}) {

	let status: StoreStatus = StoreStatus.Uninitialized

	if (account) {
		status = StoreStatus.Unlinked

		const linked =
			account.details_submitted &&
			account.payouts_enabled

		if (linked) {
			const storeInfo = await tables.billing.storeInfo.one({conditions: false})
			const active = storeInfo?.ecommerceActive
			status = active
				? StoreStatus.Enabled
				: StoreStatus.Disabled
		}
	}

	return status
}
