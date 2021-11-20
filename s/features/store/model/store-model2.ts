
import {pub} from "../../../toolbox/pub.js"
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {onesie} from "../../../toolbox/onesie.js"
import {minute} from "../../../toolbox/goodtimes/times.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {StoreStatus} from "../api/services/types/store-status.js"
import {storePrivileges} from "../permissions/store-privileges.js"
import {TriggerBankPopup} from "./shares/types/trigger-bank-popup.js"
import {SubscriptionPlan} from "../api/services/types/subscription-plan.js"
import {makeShopkeepingService} from "../api/services/shopkeeping-service.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {storageCache} from "../../../toolbox/flex-storage/cache/storage-cache.js"
import {makeStatusCheckerService} from "../api/services/status-checker-service.js"
import {makeStatusTogglerService} from "../api/services/status-toggler-service.js"
import {makeStripeConnectService} from "../api/services/stripe-connect-service.js"
import {StripeAccountDetails} from "../api/services/types/stripe-account-details.js"

export function makeStoreModel2({
		appId,
		storage,
		shopkeepingService,
		statusCheckerService,
		statusTogglerService,
		stripeAccountsService,
		triggerBankPopup,
	}: {
		appId: string
		storage: FlexStorage
		shopkeepingService: Service<typeof makeShopkeepingService>
		statusCheckerService: Service<typeof makeStatusCheckerService>
		statusTogglerService: Service<typeof makeStatusTogglerService>
		stripeAccountsService: Service<typeof makeStripeConnectService>
		triggerBankPopup: TriggerBankPopup
	}) {

	const state = snapstate({

		accessOp:
			<Op<AccessPayload>>
				ops.none(),

		statusOp:
			<Op<StoreStatus>>
				ops.none(),

		stripeAccountDetailsOp:
			<Op<StripeAccountDetails>>
				ops.none(),

		subscriptionPlansOp:
			<Op<SubscriptionPlan[]>>
				ops.none(),

		subscriptionPlanCreationOp:
			<Op<undefined>>
				ops.none(),
	})

	const bank = (() => {
		const bankChange = pub()
		async function loadLinkedStripeAccountDetails() {
			const details = await ops.operation({
				promise: stripeAccountsService.getConnectDetails(),
				setOp: op => state.writable.stripeAccountDetailsOp = op,
			})
			return details
		}
		return {
			onBankChange: bankChange.subscribe,
			loadLinkedStripeAccountDetails,
			async linkStripeAccount() {
				await triggerBankPopup(
					await stripeAccountsService.generateConnectSetupLink()
				)
				await loadLinkedStripeAccountDetails()
				await bankChange.publish()
			},
		}
	})()

	const ecommerce = (() => {
		const cache = storageCache({
			lifespan: 5 * minute,
			storage,
			storageKey: `cache-store-status-${appId}`,
			load: onesie(statusCheckerService.getStoreStatus),
		})
		async function fetchStoreStatus(forceFresh = false) {
			await ops.operation({
				setOp: op => state.writable.statusOp = op,
				promise: forceFresh
					? cache.readFresh()
					: cache.read(),
			})
		}
		let alreadyInitialized = false
		const initialize = (() => {
			return async function() {
				if (!alreadyInitialized) {
					alreadyInitialized = true
					await fetchStoreStatus()
				}
			}
		})()
		return {
			get userCanManageStore() {
				const privileges =
					ops.value(state.readable.accessOp)
						?.permit.privileges
							?? []
				return privileges.includes(storePrivileges["manage store"])
			},
			initialize,
			async enableStore() {
				await statusTogglerService.enableEcommerce()
				const newStatus = StoreStatus.Enabled
				await cache.write(newStatus)
				state.writable.statusOp = ops.ready(newStatus)
			},
			async disableStore() {
				await statusTogglerService.disableEcommerce()
				const newStatus = StoreStatus.Disabled
				await cache.write(newStatus)
				state.writable.statusOp = ops.ready(newStatus)
			},
			async handleChange() {
				if (alreadyInitialized)
					await fetchStoreStatus(true)
			},
		}
	})()

	const planning = (() => {
		return {}
	})()

	bank.onBankChange(ecommerce.handleChange)

	return {
		state: state.readable,
		subscribe: state.subscribe,

		bank,
		planning,
		ecommerce,

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			state.writable.stripeAccountDetailsOp = ops.ready(undefined)
		},
	}
}
