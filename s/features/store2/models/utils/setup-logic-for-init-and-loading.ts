import {ops} from "../../../../framework/ops.js"
import {setupStoreState} from "./setup-store-state.js"

export function setupLogicForInitAndLoading({
		loadStore, stateDetails,
	}: {
		loadStore: () => Promise<void>
		stateDetails: ReturnType <typeof setupStoreState>
	}) {

	async function load() {
		if (ops.isReady(stateDetails.snap.state.user.accessOp)) {
			await loadStore()
		}
	}

	let initialized = false

	async function initialize() {
		if (!initialized) {
			initialized = true
			await load()
		}
	}

	async function refresh() {
		if (initialized) {
			await load()
		}
	}

	return {load, initialize, refresh}
}
