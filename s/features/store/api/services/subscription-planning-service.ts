
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {subscriptionHelpers} from "./helpers/subscription-helpers.js"
import {StoreLinkedAuth, StoreMeta} from "../../types/store-metas-and-auths.js"
import {determineConnectStatus} from "./helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "./helpers/fetch-stripe-connect-details.js"
import {RoleRow} from "../../../auth/aspects/permissions/types/permissions-tables.js"
import {StoreServiceOptions, StripeConnectStatus, SubscriptionPlan} from "../../types/store-concepts.js"

const hardcodedCurrency = "usd"
const hardcodedInterval = "month"

export const makeSubscriptionPlanningService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreLinkedAuth>()({

	async policy(meta, request) {
		const auth = await options.storeLinkedPolicy(meta, request)
		auth.checker.requirePrivilege("manage store")
		const connectStatus = determineConnectStatus(
			await fetchStripeConnectDetails({
				storeTables: auth.storeTables,
				stripeLiaison: auth.stripeLiaison,
			})
		)
		if (connectStatus !== StripeConnectStatus.Ready)
			throw new ApiError(400, "stripe connect status not ready")
		return auth
	},

	expose: {

		async listPlanningDetails(auth): Promise<SubscriptionPlan[]> {

			const helpers = subscriptionHelpers(auth)
			const planRows = await helpers.fetchOurSubscriptionPlanRecords()
			const data = await helpers.crossReferenceWithStripeProducts(planRows)
			await helpers.deletePlansThatNoLongerExistOnStripe(data.missingPlanIds)

			// const tierRows = await storeTables.subscription.tiers.read(
			// 	find({stripeAccountId})
			// )

			return []
		},

		async addPlan({stripeLiaisonAccount, stripeAccountId, authTables, storeTables}, {
				planLabel, tierLabel, tierPrice,
			}: {
				planLabel: string
				tierLabel: string
				tierPrice: number
			}): Promise<SubscriptionPlan> {

			const {id: stripeProductId}
				= await stripeLiaisonAccount.products.create({name: planLabel})

			const {id: stripePriceId}
				= await stripeLiaisonAccount.prices.create({
					currency: hardcodedCurrency,
					unit_amount: tierPrice,
					recurring: {interval: hardcodedInterval},
				})

			const now = Date.now()

			function makeRole(roleId: DamnId, label: string): RoleRow {
				return {
					label,
					roleId,
					hard: true,
					public: true,
					assignable: true,
					time: now,
				}
			}

			const planId = options.generateId()
			const planRoleId = options.generateId()
			const tierId = options.generateId()
			const tierRoleId = options.generateId()

			await authTables.permissions.role.create(
				makeRole(planRoleId, planLabel),
				makeRole(tierRoleId, tierLabel),
			)

			await storeTables.subscription.plans.create({
				planId,
				label: planLabel,
				roleId: planRoleId,
				stripeProductId,
				time: now,
				stripeAccountId,
			})

			await storeTables.subscription.tiers.create({
				tierId,
				planId,
				label: tierLabel,
				roleId: tierRoleId,
				stripePriceId,
				time: now,
				stripeAccountId,
			})

			return {
				planId: planId.toString(),
				label: planLabel,
				time: now,
				tiers: [
					{
						tierId: tierId.toString(),
						label: tierLabel,
						price: tierPrice,
						time: now,
					}
				],
			}
		},

		async addTier({stripeLiaisonAccount}, {}: {
				label: string
				price: number
				planId: string
			}) {
			return undefined
		},

		async editPlan() {},
		async editTier() {},
	},
})
