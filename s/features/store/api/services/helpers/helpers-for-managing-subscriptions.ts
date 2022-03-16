
import * as dbmage from "dbmage"
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"
import {SubscriptionTierRow} from "../../../types/store-schema.js"

export const helpersForManagingSubscriptions = ({
		database,
		stripeAccountId,
		stripeLiaisonAccount,
		generateId,
	}: StoreLinkedAuth & {
		generateId: () => dbmage.Id
	}) => {

	const authTables = database.tables.auth
	const storeTables = database.tables.store
	const time = Date.now()

	function makeRoleRow(roleId: dbmage.Id, label: string) {
		return {
			label,
			roleId,
			hard: true,
			public: true,
			assignable: true,
			time,
		}
	}

	return {

		async createStripeProductAndPrice(options: {
				planLabel: string
				tierPrice: number
				tierCurrency: string
				tierInterval: "month" | "year"
			}) {

			const {id: stripeProductId} = await stripeLiaisonAccount.products.create({
				name: options.planLabel
			})

			const {id: stripePriceId} = await stripeLiaisonAccount.prices.create({
				currency: options.tierCurrency,
				unit_amount: options.tierPrice,
				recurring: {interval: options.tierInterval},
			})

			return {stripeProductId, stripePriceId}
		},

		async createStripePriceForProduct(options: {
				stripeProductId: string
				tierPrice: number
				tierCurrency: "usd"
				tierInterval: "month" | "year"
			}) {

			const {id: stripePriceId} = await stripeLiaisonAccount.prices.create({
				currency: options.tierCurrency,
				unit_amount: options.tierPrice,
				recurring: {interval: options.tierInterval},
			})

			return {stripePriceId}
		},

		async createPlanAndTier({
				planLabel, tierLabel, stripePriceId, stripeProductId,
			}: {
				planLabel: string
				tierLabel: string
				stripePriceId: string
				stripeProductId: string
			}) {

			const planId = generateId()
			const planRoleId = generateId()
			const tierId = generateId()
			const tierRoleId = generateId()

			await authTables.permissions.role.create(
				makeRoleRow(planRoleId, planLabel),
				makeRoleRow(tierRoleId, tierLabel),
			)

			await storeTables.subscriptions.plans.create({
				planId,
				label: planLabel,
				roleId: planRoleId,
				time,
				stripeProductId,
				// stripeAccountId,
			})

			await storeTables.subscriptions.tiers.create({
				tierId,
				planId,
				label: tierLabel,
				roleId: tierRoleId,
				time,
				stripePriceId,
				// stripeAccountId,
			})

			return {planId, tierId, planRoleId, tierRoleId, time}
		},

		async createTierForPlan({
				price, planId, tierLabel, tierCurrency, tierInterval,
			}: {
				price: number
				planId: string
				tierLabel: string
				tierCurrency: "usd"
				tierInterval: "month" | "year"
			}) {

			const planRow = await storeTables.subscriptions.plans.readOne(
				dbmage.find({planId: dbmage.Id.fromString(planId)})
			)

			if (!planRow)
				throw new Error(`unknown subscription plan ${planId}`)

			const {id: stripePriceId} = await stripeLiaisonAccount.prices.create({
				unit_amount: price,
				currency: tierCurrency,
				recurring: {interval: tierInterval},
			})

			const roleId = generateId()
			await authTables.permissions.role.create(
				makeRoleRow(roleId, tierLabel),
			)

			const time = Date.now()
			const tierId = generateId()

			const tierRow: SubscriptionTierRow = {
				time,
				tierId,
				roleId,
				stripePriceId,
				label: tierLabel,
				planId: planRow.planId,
			}

			await storeTables.subscriptions.tiers.create(tierRow)

			return {tierId, roleId, time}
		},
	}
}
