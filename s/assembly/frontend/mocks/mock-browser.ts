
import {memoryFlexStorage} from "dbmage"

import {mockRemote} from "./mock-remote.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {assembleModels} from "../models/assemble-models.js"
import {mockModalSystem} from "../modal/mock-modal-system.js"
import {MockStripeOperations} from "../../../features/store2/stripe/types.js"
import {mockStorePopups} from "../../../features/store2/popups/mock-store-popups.js"
import {chatMockClientEntirely} from "../../../features/chat/api/sockets/chat-mock-client-entirely.js"
import {mockStoreRig} from "../../../features/store2/testing/parts/mock-rig.js"

export async function mockBrowser({api, appOrigin, mockStripeOperations}: {
		api: SystemApi
		appOrigin: string
		mockStripeOperations: MockStripeOperations
	}) {

	async function mockAppWindow({appId}: {appId: string}) {
		const storage = memoryFlexStorage()
		const {remote, authMediator} = mockRemote({
			api,
			appId,
			storage,
			logging: false,
			headers: {origin: appOrigin},
		})

		const {nextModalResults} = mockModalSystem()
		const models = await assembleModels({
			appId,
			remote,
			storage,
			authMediator,
			storePopups: mockStorePopups({
				rig: mockStoreRig(),
				mockStripeOperations,
			}),
			chatConnect: await chatMockClientEntirely(storage),
		})

		return {models, remote, nextModalResults}
	}

	return {mockAppWindow}
}
