
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {mixinShare, mixinMadstateSubscriptions} from "../../../../framework/component/component.js"
import {XiomeMyAvatar} from "../../../../features/auth/aspects/users/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "../../../../features/auth/aspects/users/components/my-account/xiome-my-account.js"
import {XiomeAppManager} from "../../../../features/auth/aspects/apps/components/app-manager/xiome-app-manager.js"
import {XiomeLoginPanel} from "../../../../features/auth/aspects/users/components/login-panel/xiome-login-panel.js"
import {XiomePermissions} from "../../../../features/auth/aspects/permissions/components/permissions/xiome-permissions.js"

export function xiomeAuthComponents({models, modals}: XiomeComponentOptions) {
	const {accessModel, appsModel, personalModel, permissionsModel} = models
	return {
		XiomeMyAvatar:
			mixinMadstateSubscriptions(accessModel.subscribe)(
				mixinShare({
					accessModel,
				})(XiomeMyAvatar)
			),
		XiomeLoginPanel:
			mixinMadstateSubscriptions(accessModel.subscribe)(
				mixinShare({
					accessModel,
				})(XiomeLoginPanel)
			),
		XiomeAppManager:
			mixinMadstateSubscriptions(appsModel.subscribe)(
				mixinShare({
					modals,
					appsModel,
				})(XiomeAppManager)
			),
		XiomeMyAccount:
			mixinMadstateSubscriptions(personalModel.subscribe)(
				mixinShare({
					personalModel,
				})(XiomeMyAccount)
			),
		XiomePermissions:
			mixinMadstateSubscriptions(permissionsModel.subscribe)(
				mixinShare({
					modals,
					permissionsModel,
				})(XiomePermissions)
			),
	}
}
