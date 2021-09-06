
import {XiomeManageUsers} from "./xiome-manage-users/xiome-manage-users.js"
import {mixinMadstateSubscriptions, mixinShare} from "../../../framework/component/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateAdministrativeComponents({models, modals}: XiomeComponentOptions) {
	const {administrativeModel} = models
	return {
		XiomeManageUsers: (
			mixinMadstateSubscriptions(administrativeModel.subscribe)(
				mixinShare({
					modals,
					administrativeModel,
				})(XiomeManageUsers)
			)
		),
	}
}
