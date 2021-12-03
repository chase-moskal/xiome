
import {Suite, expect} from "cynic"
import {ops} from "../../framework/ops.js"
import {storePrivileges} from "./store-privileges.js"
import {StripeConnectStatus} from "./types/store-concepts.js"
import {setupSimpleStoreClient, setupLinkedStore} from "./testing/store-quick-setup.js"

export default <Suite>{

	"store connect submodel": {
		"connect a stripe account": {

			async "merchant can connect a stripe account"() {
				const {storeModel, ...client} = await setupSimpleStoreClient(
					"control stripe account"
				)
				const getConnectDetails = () => ops.value(
					storeModel.state.connectDetailsOp
				)
				expect(getConnectDetails()).not.ok()
				await storeModel.connectSubmodel.connectStripeAccount()
				expect(getConnectDetails()).ok()
				await client.setLoggedOut()
				expect(getConnectDetails()).not.ok()
			},
			async "plebeian cannot connect a stripe account"() {
				const {storeModel} = await setupSimpleStoreClient()
				await expect(
					async() => storeModel.connectSubmodel.connectStripeAccount()
				).throws()
			},
			async "a second merchant can see the connect details"() {
				const {merchantClient, makeAnotherMerchantClient}
					= await setupLinkedStore()
				expect(ops.value(merchantClient.storeModel.state.connectDetailsOp)).ok()
	
				const anotherMerchant = await makeAnotherMerchantClient()
				await anotherMerchant.storeModel.connectSubmodel.activate()
				expect(ops.value(anotherMerchant.storeModel.state.connectDetailsOp)).ok()
			},
			async "plebeian cannot see connect details or status"() {
				const {makePlebeianClient} = await setupLinkedStore()
				const plebeianClient = await makePlebeianClient()
				await plebeianClient.storeModel.connectSubmodel.activate()
				const {state} = plebeianClient.storeModel
				expect(ops.value(state.connectDetailsOp)).not.defined()
				expect(ops.value(state.connectStatusOp)).not.defined()
			},
			async "clerk can see the connect status, but not the details"() {
				const {makeClerkClient} = await setupLinkedStore()
				const clerkClient = await makeClerkClient()
				await clerkClient.setAccessWithPrivileges(storePrivileges["manage store"])
				await clerkClient.storeModel.connectSubmodel.activate()
				const {state} = clerkClient.storeModel
				expect(ops.value(state.connectStatusOp)).defined()
				expect(ops.value(state.connectDetailsOp)).not.defined()
			},
		},

		"pause and resume the stripe account": {

			async "merchant can pause and resume a store"() {
				const {merchantClient} = await setupLinkedStore()
				const {state, connectSubmodel} = merchantClient.storeModel
				function expectReady() {
					expect(ops.value(state.connectStatusOp))
						.equals(StripeConnectStatus.Ready)
					expect(ops.value(state.connectDetailsOp)?.paused)
						.equals(false)
				}
				function expectPaused() {
					expect(ops.value(state.connectStatusOp))
						.equals(StripeConnectStatus.Paused)
					expect(ops.value(state.connectDetailsOp)?.paused)
						.equals(true)
				}
				expectReady()
				await connectSubmodel.pause()
				expectPaused()
				await connectSubmodel.refresh()
				expectPaused()
				await connectSubmodel.resume()
				expectReady()
				await connectSubmodel.refresh()
				expectReady()
			},
			async "clerk can pause and resume a store"() {
				const {makeClerkClient} = await setupLinkedStore()
				const clerkClient = await makeClerkClient()
				const {state, connectSubmodel} = clerkClient.storeModel
				function expectReady() {
					expect(ops.value(state.connectStatusOp))
						.equals(StripeConnectStatus.Ready)
				}
				function expectPaused() {
					expect(ops.value(state.connectStatusOp))
						.equals(StripeConnectStatus.Paused)
				}
				expectReady()
				await connectSubmodel.pause()
				expectPaused()
				await connectSubmodel.refresh()
				expectPaused()
				await connectSubmodel.resume()
				expectReady()
				await connectSubmodel.refresh()
				expectReady()
			},
		},

		"login to stripe account": {

			async "merchant can login to connected stripe account"() {},
		},
	},
}
