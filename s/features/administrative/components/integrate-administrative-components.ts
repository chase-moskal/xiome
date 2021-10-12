
import {XiomeManageUsers} from "./xiome-manage-users/xiome-manage-users.js"
import {mixinSnapstateSubscriptions, mixinShare} from "../../../framework/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateAdministrativeComponents({models, modals}: XiomeComponentOptions) {
	const {administrativeModel} = models
	return {
		XiomeManageUsers: (
			mixinSnapstateSubscriptions(administrativeModel.subscribe)(
				mixinShare({
					modals,
					administrativeModel,
				})(XiomeManageUsers)
			)
		),
	}
}
