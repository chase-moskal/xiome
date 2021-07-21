
import {SubscriptionPlan} from "../types/subscription-plan.js"
import {SubscriptionPlanRow} from "../../tables/types/rows/subscription-plan-row.js"
import {RoleRow} from "../../../../auth/aspects/permissions/types/permissions-tables.js"

export function subscriptionPlanFromRow({role, plan}: {
		role: RoleRow
		plan: SubscriptionPlanRow
	}) {
	return <SubscriptionPlan>{
		subscriptionPlanId: plan.subscriptionPlanId.toString(),
		roleId: role.roleId.toString(),
		label: role.label,
		price: plan.price,
		active: plan.active,
	}
}
