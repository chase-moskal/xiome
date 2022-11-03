
import {StoreState} from "../../state.js"
import {ops} from "../../../../../framework/ops.js"

export function setupLogicForInitAndLoading({
		state, loadStore,
	}: {
		state: StoreState
		loadStore: () => Promise<void>
	}) {

	async function load() {
		if (ops.isReady(state.user.accessOp))
			await loadStore()
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
