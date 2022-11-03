
import {memoryFlexStorage} from "dbmage"

import {mockRemote} from "./mock-remote.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {assembleModels} from "../models/assemble-models.js"
import {mockModalSystem} from "../modal/mock-modal-system.js"
import {mockStoreRig} from "../../../features/store/testing/utils/mock-rig.js"
import {MockStripeOperations} from "../../../features/store/backend/stripe/types.js"
import {chatMockClientEntirely} from "../../../features/chat/api/sockets/chat-mock-client-entirely.js"
import {riggedStripePopups} from "../../../features/store/popups/rigged-stripe-popups.js"

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
			stripePopups: riggedStripePopups({
				rig: mockStoreRig(),
				mockStripeOperations,
			}),
			chatConnect: await chatMockClientEntirely(storage),
		})

		return {models, remote, nextModalResults}
	}

	return {mockAppWindow}
}
