
import * as renraku from "renraku"

import {storeApi} from "../api/store-api.js"
import {storePrivileges} from "../store-privileges.js"
import {makeStoreModel} from "../models/store-model.js"
import {mockStripeCircuit} from "../stripe/mock-stripe-circuit.js"
import {authTestSetup} from "../../auth/testing/auth-test-setup.js"
import {DisabledLogger} from "../../../toolbox/logger/disabled-logger.js"

export async function storeTestSetup() {
	const {
		appId, rando, config, storage, appOrigin, authPolicies, databaseRaw,
		makeClient: makeClientForAuth, createRole,
	} = await authTestSetup()

	const {stripeLiaison, mockStripeOperations} = await mockStripeCircuit({
		rando,
		databaseRaw,
		tableStorage: storage,
		logger: new DisabledLogger(),
	})

	const api = storeApi({
		config,
		stripeLiaison,
		accountReturningLinks: {
			refresh: "https://api.xiome.io/store/stripe?x=refresh",
			return: "https://api.xiome.io/store/stripe?x=return",
		},
		checkoutReturningLinks: {
			cancel: "https://api.xiome.io/store/stripe?x=cancel",
			success: "https://api.xiome.io/store/stripe?x=success",
		},
		generateId: () => rando.randomId(),
		basePolicy: authPolicies.anonPolicy,
	})

	const clerkRoleId = await createRole("clerk", [
		storePrivileges["manage store"],
		storePrivileges["give away freebies"],
	])

	return {
		api,
		stripeLiaison,
		mockStripeOperations,
		clerkRoleId,
		async makeClient(...roleIds: string[]) {
			const {accessModel, authMediator, logBackIn} = await makeClientForAuth(...roleIds)

			let stripeLinkWillSucceed = true
			let stripeLoginResultsWillChange: undefined | "complete" | "incomplete" = undefined

			let stripeLoginCount = 0

			const getHeaders = async() => ({origin: appOrigin})
			const getMeta = async() => ({
				accessToken: await authMediator.getValidAccessToken(),
			})

			const remotes = {
				connectService: renraku.mock()
					.forService(api.connectService)
					.withMeta(getMeta, getHeaders),
				subscriptionPlanningService: renraku.mock()
					.forService(api.subscriptionPlanningService)
					.withMeta(getMeta, getHeaders),
				subscriptionShoppingService: renraku.mock()
					.forService(api.subscriptionShoppingService)
					.withMeta(getMeta, getHeaders),
				billingService: renraku.mock()
					.forService(api.billingService)
					.withMeta(getMeta, getHeaders),
			}

			const storeModel = makeStoreModel({
				...remotes,
				appId: appId.toString(),
				storageForCache: storage,
				reauthorize: accessModel.reauthorize,
				triggerStripeConnectPopup: async({stripeAccountId}) => {
					if (stripeLinkWillSucceed)
						mockStripeOperations
							.linkStripeAccount(stripeAccountId)
					else
						mockStripeOperations
							.linkStripeAccountThatIsIncomplete(stripeAccountId)
				},
				triggerStripeLogin: async({stripeAccountId}) => {
					if (stripeLoginResultsWillChange) {
						mockStripeOperations.configureStripeAccount(
							stripeAccountId,
							stripeLoginResultsWillChange === "complete"
								? true
								: false
						)
					}
					stripeLoginCount += 1
				},
				triggerCheckoutPaymentMethodPopup: async({stripeAccountId, stripeSessionId}) => {
					await mockStripeOperations.updatePaymentMethod(stripeAccountId, stripeSessionId)
				},
				triggerCheckoutSubscriptionPopup: async({stripeAccountId, stripeSessionId}) => {
					await mockStripeOperations.checkoutSubscriptionTier(stripeAccountId, stripeSessionId)
				},
			})

			accessModel.track(({accessOp}) => storeModel.updateAccessOp(accessOp))

			// async function setAccess(access: AccessPayload) {
			// 	currentAccess = access
			// 	await storeModel.updateAccessOp(ops.ready(access))
			// }

			// async function setAccessWithPrivileges(...privileges: string[]) {
			// 	await setAccess(mockAccess({
			// 		rando,
			// 		appId,
			// 		appOrigin,
			// 		privileges: [
			// 			appPermissions.privileges["universal"],
			// 			...privileges,
			// 		],
			// 	}))
			// }

			// async function setLoggedOut() {
			// 	await setAccess({
			// 		...mockAccess({
			// 			rando,
			// 			appId,
			// 			appOrigin,
			// 			privileges: [
			// 				appPermissions.privileges["universal"]
			// 			],
			// 		}),
			// 		user: undefined,
			// 	})
			// }

			return {
				logBackIn,
				storeModel,
				accessModel,
				authMediator,
				// setAccess,
				// setLoggedOut,
				// setAccessWithPrivileges,
				getStripeLoginCount() { return stripeLoginCount },
				rigStripeLinkToFail() { stripeLinkWillSucceed = false },
				rigStripeLinkToSucceed() { stripeLinkWillSucceed = true },
				rigStripeLoginToConfigureCompleteAccount() { stripeLoginResultsWillChange = "complete" },
				rigStripeLoginToConfigureIncompleteAccount() { stripeLoginResultsWillChange = "incomplete" },
			}
		},
	}
}
