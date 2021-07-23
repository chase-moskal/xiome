
import {storeCore} from "../core/store-core.js"
import {ops} from "../../../../framework/ops.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {Service} from "../../../../types/service.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {StoreStatus} from "../../api/services/types/store-status.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {storageCache} from "../../../../toolbox/flex-storage/cache/storage-cache.js"
import {makeStatusCheckerService} from "../../api/services/status-checker-service.js"
import {makeStatusTogglerService} from "../../api/services/status-toggler-service.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard-permissions.js"

export function ecommerceShare({
		appId,
		storage,
		statusCheckerService,
		statusTogglerService,
		core: {state, actions},
	}: {
		appId: string
		storage: FlexStorage
		core: ReturnType<typeof storeCore>
		statusCheckerService: Service<typeof makeStatusCheckerService>
		statusTogglerService: Service<typeof makeStatusTogglerService>
	}) {

	const cache = storageCache({
		lifespan: 5 * minute,
		storage,
		storageKey: `cache-store-status-${appId}`,
		load: onesie(statusCheckerService.getStoreStatus),
	})

	async function fetchStoreStatus(forceFresh = false) {
		await ops.operation({
			promise: forceFresh
				? cache.readFresh()
				: cache.read(),
			setOp: op => actions.setStatus(op),
		})
	}

	async function enableEcommerce() {
		await statusTogglerService.enableEcommerce()
		const newStatus = StoreStatus.Enabled
		await cache.write(newStatus)
		actions.setStatus(ops.ready(newStatus))
	}
	
	async function disableEcommerce() {
		await statusTogglerService.disableEcommerce()
		const newStatus = StoreStatus.Disabled
		await cache.write(newStatus)
		actions.setStatus(ops.ready(newStatus))
	}

	const initialize = (() => {
		let done = false
		return async function() {
			if (!done) {
				done = true
				await fetchStoreStatus()
			}
		}
	})()

	return {
		get access() { return state.access },
		get storeStatus() { return state.status },
		get userCanManageStore() {
			return state.access
				? state.access.permit.privileges.includes(
					appPermissions.privileges["manage store"]
				)
				: false
		},
		initialize,
		enableEcommerce,
		disableEcommerce,
	}
}
