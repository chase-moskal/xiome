
import {mockRemote} from "./mock-remote.js"
import {assembleModels} from "../assemble-models.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {mockModalSystem} from "../modal/mock-modal-system.js"
import {mockPopups} from "../connect/mock/common/mock-popups.js"
import {MockLatency} from "../../../framework/add-mock-latency.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {MockStripeOperations} from "../../../features/store/stripe2/types/mock-stripe-operations.js"

export async function mockBrowser({api, mockStripeOperations}: {
		api: SystemApi
		mockStripeOperations: MockStripeOperations
	}) {

	async function mockAppWindow({
			appId,
			apiLink,
			latency,
			windowLink,
		}: {
			appId: string
			apiLink: string
			windowLink: string
			latency: MockLatency
		}) {

		const storage = memoryFlexStorage()
		const {remote, authMediator} = mockRemote({
			api,
			appId,
			apiLink,
			latency,
			storage,
			origin: new URL(windowLink).origin,
		})

		const {modals, nextModalResults} = mockModalSystem()
		const models = await assembleModels({
			appId,
			remote,
			storage,
			authMediator,
			popups: mockPopups({mockStripeOperations}),
		})

		return {models, remote, nextModalResults}
	}

	return {mockAppWindow}
}
