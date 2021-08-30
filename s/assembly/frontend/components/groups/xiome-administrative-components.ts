
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {mixinHappy, mixinShare} from "../../../../framework/component/component.js"
import {XiomeManageUsers} from "../../../../features/administrative/components/xiome-manage-users.js"

export function xiomeAdministrativeComponents({models, modals}: XiomeComponentOptions) {
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
