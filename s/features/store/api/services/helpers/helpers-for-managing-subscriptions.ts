
import {Id} from "dbmage"
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"

export const helpersForManagingSubscriptions = ({
		database,
		stripeAccountId,
		stripeLiaisonAccount,
		generateId,
	}: StoreLinkedAuth & {
		generateId: () => Id
	}) => {

	const authTables = database.tables.auth
	const storeTables = database.tables.store
	const time = Date.now()

	function makeRoleRow(roleId: Id, label: string) {
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
				stripeAccountId,
			})

			await storeTables.subscriptions.tiers.create({
				tierId,
				planId,
				label: tierLabel,
				roleId: tierRoleId,
				time,
				stripePriceId,
				stripeAccountId,
			})

			return {planId, tierId, time}
		},
	}
}
