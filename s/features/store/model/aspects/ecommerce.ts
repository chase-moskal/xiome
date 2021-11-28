
import {ops} from "../../../../framework/ops.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {Service} from "../../../../types/service.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreState} from "../state/make-store-state.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {StoreStatus} from "../../api/services/types/store-status.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {storageCache} from "../../../../toolbox/flex-storage/cache/storage-cache.js"
import {makeStatusCheckerService} from "../../api/services/status-checker-service.js"
import {makeStatusTogglerService} from "../../api/services/status-toggler-service.js"

export function makeEcommerceSubmodel({
		appId,
		state,
		storage,
		statusCheckerService,
		statusTogglerService,
	}: {
		appId: string
		storage: FlexStorage
		state: ReturnType<typeof makeStoreState>
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
			setOp: op => state.writable.statusOp = op,
			promise: forceFresh
				? cache.readFresh()
				: cache.read(),
		})
	}

	const activator = makeActivator(fetchStoreStatus)

	return {
		activate: activator.activate,
		async refresh() {
			await fetchStoreStatus(true)
		},
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
	}
}
