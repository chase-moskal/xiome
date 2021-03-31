
import {SubscriptionPlan} from "../types/subscription-plan.js"
import {RoleRow} from "../../../auth/tables/types/rows/role-row.js"
import {SubscriptionPlanRow} from "../../api/tables/types/rows/subscription-plan-row.js"

export function subscriptionPlanFromRow({role, plan}: {
		role: RoleRow
		plan: SubscriptionPlanRow
	}) {
	return <SubscriptionPlan>{
		subscriptionPlanId: plan.subscriptionPlanId,
		label: role.label,
		price: plan.price,
		active: plan.active,
		roleId: role.roleId,
	}
}
