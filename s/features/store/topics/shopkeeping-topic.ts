
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {apiProblems} from "../../../toolbox/api-validate.js"
import {RoleRow} from "../../auth/tables/types/rows/role-row.js"
import {ClerkAuth} from "../api/policies/types/contexts/clerk-auth.js"
import {subscriptionPlanFromRow} from "./utils/subscription-plan-from-row.js"
import {SubscriptionPlanRow} from "../api/tables/types/rows/subscription-plan-row.js"
import {validateSubscriptionPlanDraft} from "./utils/validate-subscription-plan-draft.js"
import {SubscriptionPlanDraft} from "../api/tables/types/drafts/subscription-plan-draft.js"

const hardcodedCurrency = "usd"
const hardcodedInterval = "month"

export const shopkeepingTopic = ({generateId}: {
		generateId: () => string
	}) => asTopic<ClerkAuth>()({

	async listSubscriptionPlans({tables}) {
		const rows = await tables.billing.subscriptionPlans
			.read({conditions: false})

		const roleFinders = rows
			.map(row => row.roleId)
			.map(roleId => ({roleId}))

		const roles = await tables.permissions.role.read(find(...roleFinders))

		const plans = rows.map(plan => subscriptionPlanFromRow({
			plan,
			role: roles.find(role => role.roleId === plan.roleId),
		}))

		return plans
	},

	async createSubscriptionPlan(
			{tables, stripeLiaisonForApp},
			{draft}: {draft: SubscriptionPlanDraft}
		) {

		apiProblems(validateSubscriptionPlanDraft(draft))

		const stripeProduct = await stripeLiaisonForApp.products.create({
			name: draft.label,
		})

		const stripePrice = await stripeLiaisonForApp.prices.create({
			unit_amount: draft.price,
			currency: hardcodedCurrency,
			recurring: {interval: hardcodedInterval},
		})

		const role: RoleRow = {
			hard: true,
			public: true,
			label: draft.label,
			roleId: generateId(),
			assignable: true,
		}

		const plan: SubscriptionPlanRow = {
			active: true,
			price: draft.price,
			roleId: role.roleId,
			stripePriceId: stripePrice.id,
			stripeProductId: stripeProduct.id,
			subscriptionPlanId: generateId(),
		}

		await Promise.all([
			tables.permissions.role.create(role),
			tables.billing.subscriptionPlans.create(plan),
		])

		return subscriptionPlanFromRow({role, plan})
	},

	async updateSubscriptionPlan(
		{tables, stripeLiaisonForApp},
		{subscriptionPlanId, draft}: {
			subscriptionPlanId: string
			draft: SubscriptionPlanDraft
		}) {

		apiProblems(validateSubscriptionPlanDraft(draft))

		const stripeNewPrice = await stripeLiaisonForApp.prices.create({
			unit_amount: draft.price,
			currency: hardcodedCurrency,
			recurring: {interval: hardcodedInterval},
		})

		await tables.billing.subscriptionPlans.update({
			...find({subscriptionPlanId}),
			write: {
				stripePriceId: stripeNewPrice.id,
				price: stripeNewPrice.unit_amount,
			},
		})

		const plan = await tables.billing.subscriptionPlans
			.one(find({subscriptionPlanId}))

		await tables.permissions.role.update({
			...find({roleId: plan.roleId}),
			write: {label: draft.label},
		})

		const role = await tables.permissions.role
			.one(find({roleId: plan.roleId}))

		return subscriptionPlanFromRow({role, plan})
	},

	async deactivateSubscriptionPlan(
			{tables, stripeLiaisonForApp},
			{subscriptionPlanId}: {subscriptionPlanId: string},
		) {

		const {stripePriceId} = await tables.billing.subscriptionPlans
			.one(find({subscriptionPlanId}))

		await stripeLiaisonForApp.prices
			.update(stripePriceId, {active: false})

		// TODO cancel all stripe subscriptions

		await tables.billing.subscriptionPlans.update({
			...find({subscriptionPlanId}),
			write: {active: false},
		})
	},

	async deleteSubscriptionPlan(
			{tables},
			{subscriptionPlanId}: {subscriptionPlanId: string}
		) {

		const {roleId, active} = await tables.billing.subscriptionPlans
			.one(find({subscriptionPlanId}))

		if (active)
			throw new ApiError(400, `deleting active subscriptions is forbidden`)

		await Promise.all([
			tables.permissions.role.delete(find({roleId})),
			tables.billing.subscriptionPlans.delete(find({subscriptionPlanId})),
		])
	},
})
