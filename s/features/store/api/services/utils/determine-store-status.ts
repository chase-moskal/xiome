
import {Stripe} from "stripe"
import {StoreStatus} from "../types/store-status.js"
import {StoreTables} from "../../types/store-tables.js"

export async function determineStoreStatus({
		storeTables,
		account,
	}: {
		storeTables: StoreTables
		account: undefined | Stripe.Account
	}) {

	let status: StoreStatus = StoreStatus.Uninitialized

	if (account) {
		status = StoreStatus.Unlinked

		const linked =
			account.details_submitted &&
			account.payouts_enabled

		if (linked) {
			const storeInfo = await storeTables.billing.storeInfo.one({conditions: false})
			const active = storeInfo?.ecommerceActive
			status = active
				? StoreStatus.Enabled
				: StoreStatus.Disabled
		}
	}

	return status
}
