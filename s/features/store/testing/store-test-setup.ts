
import * as renraku from "renraku"

import {storeApi} from "../api/store-api.js"
import {ops} from "../../../framework/ops.js"
import {makeStoreModel} from "../models/store-model.js"
import {mockMeta} from "../../../common/testing/mock-meta.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {mockAccess} from "../../../common/testing/mock-access.js"
import {mockStripeCircuit} from "../stripe/mock-stripe-circuit.js"
import {DisabledLogger} from "../../../toolbox/logger/disabled-logger.js"
import {prepareMockAuth} from "../../../common/testing/prepare-mock-auth.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"

export async function storeTestSetup() {
	const {appId, rando, config, storage, appOrigin, authPolicies, databaseRaw}
		= await prepareMockAuth()

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

	return {
		api,
		stripeLiaison,
		mockStripeOperations,
		async makeClient() {
			let currentAccess: AccessPayload
			let stripeLinkWillSucceed = true
			let stripeLoginResultsWillChange: undefined | "complete" | "incomplete" = undefined

			let stripeLoginCount = 0

			const getMeta = async() => mockMeta({access: currentAccess})
			const getHeaders = async() => ({origin: appOrigin})

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

			async function setAccess(access: AccessPayload) {
				currentAccess = access
				await storeModel.updateAccessOp(ops.ready(access))
			}

			async function setAccessWithPrivileges(...privileges: string[]) {
				await setAccess(mockAccess({
					rando,
					appId,
					appOrigin,
					privileges: [
						appPermissions.privileges["universal"],
						...privileges,
					],
				}))
			}

			async function setLoggedOut() {
				await setAccess({
					...mockAccess({
						rando,
						appId,
						appOrigin,
						privileges: [
							appPermissions.privileges["universal"]
						],
					}),
					user: undefined,
				})
			}

			return {
				storeModel,
				setAccess,
				setLoggedOut,
				setAccessWithPrivileges,
				getStripeLoginCount() { return stripeLoginCount },
				rigStripeLinkToFail() { stripeLinkWillSucceed = false },
				rigStripeLinkToSucceed() { stripeLinkWillSucceed = true },
				rigStripeLoginToConfigureCompleteAccount() { stripeLoginResultsWillChange = "complete" },
				rigStripeLoginToConfigureIncompleteAccount() { stripeLoginResultsWillChange = "incomplete" },
			}
		},
	}
}
