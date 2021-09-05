
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"
import {mixinHappy, mixinShare} from "../../../framework/component/component.js"
import {XiomeManageUsers} from "./xiome-manage-users/xiome-manage-users.js"

export function integrateAdministrativeComponents({models, modals}: XiomeComponentOptions) {
	const {administrativeModel} = models
	return {
		XiomeManageUsers: mixinHappy(administrativeModel.onStateChange)(
			mixinShare({
				modals,
				administrativeModel,
			})(XiomeManageUsers)
		),
	}
}
