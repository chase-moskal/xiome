
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {apiProblems} from "../../../toolbox/api-validate.js"
import {SubscriptionPlan} from "./types/subscription-plan.js"
import {RoleRow} from "../../auth/tables/types/rows/role-row.js"
import {ClerkAuth} from "../api/policies/types/contexts/clerk-auth.js"
import {SubscriptionPlanRow} from "../api/tables/types/rows/subscription-plan-row.js"
import {SubscriptionPlanDraft} from "../api/tables/types/drafts/subscription-plan-draft.js"
import {validateSubscriptionPlanDraft} from "./validators/validate-subscription-plan-draft.js"

export const shopkeepingTopic = ({generateId}: {
		generateId: () => string
	}) => asTopic<ClerkAuth>()({

	async listSubscriptionPlans({tables}) {
		// const rows = await tables.billing.subscriptionPlans
		// 	.read({conditions: false})
		// const roleFinders = rows
		// 	.map(row => row.roleId)
		// 	.map(roleId => ({roleId}))
		// const roles = await tables.permissions.role.read(find(...roleFinders))
		// const plans = rows.map(row => {
		// 	const role = roles.find(role => role.roleId === row.roleId)
		// 	return <SubscriptionPlan>{
		// 		label: role.label,
		// 		price: row.price,
		// 		roleId: row.roleId,
		// 		subscriptionPlanId: row.subscriptionPlanId,
		// 	}
		// })
		// return plans
	},

	async createSubscriptionPlan(
		{tables, stripeLiaisonForApp},
		{draft}: {
			draft: SubscriptionPlanDraft
		}) {

		apiProblems(validateSubscriptionPlanDraft(draft))

		// const stripeProduct = await stripeLiaisonForApp.products.create({
		// 	name: draft.label,
		// })

		// const stripePrice = await stripeLiaisonForApp.prices.create({
		// 	currency: "usd",
		// 	unit_amount: draft.price,
		// 	recurring: {interval: "month"},
		// })

		// const role: RoleRow = {
		// 	hard: true,
		// 	label: draft.label,
		// 	roleId: generateId(),
		// }

		// const subscriptionPlanRow: SubscriptionPlanRow = {
		// 	price: draft.price,
		// 	roleId: role.roleId,
		// 	stripePriceId: stripePrice.id,
		// 	stripeProductId: stripeProduct.id,
		// 	subscriptionPlanId: generateId(),
		// }

		// await Promise.all([
		// 	tables.permissions.role.create(role),
		// 	tables.billing.subscriptionPlans.create(subscriptionPlanRow),
		// ])

		// return subscriptionPlanRow
	},

	async updateSubscriptionPlan(
		{tables, stripeLiaisonForApp, checker},
		{subscriptionPlanId}: {
			subscriptionPlanId: string
		}) {
		return true
	},

	async deleteSubscriptionPlan(
		{tables, stripeLiaisonForApp, checker},
		{subscriptionPlanId}: {
			subscriptionPlanId: string
		}) {
		return true
	},
})
