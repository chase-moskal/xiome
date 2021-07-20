
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {mixinHappy} from "../../../framework/component2/mixins/mixin-happy.js"
import {mixinAutotrack, mixinShare} from "../../../framework/component2/component2.js"
import {XiomeMyAvatar} from "../../../features/auth2/aspects/users/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "../../../features/auth2/aspects/users/components/my-account/xiome-my-account.js"
import {XiomeAppManager} from "../../../features/auth2/aspects/apps/components/app-manager/xiome-app-manager.js"
import {XiomeLoginPanel} from "../../../features/auth2/aspects/users/components/login-panel/xiome-login-panel.js"
import {XiomePermissions} from "../../../features/auth2/aspects/permissions/components/permissions/xiome-permissions.js"

export function xiomeAuthComponents({models, modals}: XiomeComponentOptions) {
	const {authModel, appModel, personalModel, permissionsModel} = models
	return {
		XiomeMyAvatar:
			mixinAutotrack(authModel.track)(
				mixinShare({
					authModel,
				})(XiomeMyAvatar)
			),
		XiomeLoginPanel:
			mixinAutotrack(authModel.track)(
				mixinShare({
					authModel,
				})(XiomeLoginPanel)
			),
		XiomeAppManager:
			mixinHappy(appModel.onStateChange)(
				mixinShare({
					modals,
					appModel,
				})(XiomeAppManager)
			),
		XiomeMyAccount:
			mixinAutotrack(authModel.track)(
				mixinShare({
					authModel,
					personalModel,
				})(XiomeMyAccount)
			),
		XiomePermissions:
			mixinHappy(permissionsModel.onStateChange)(
				mixinShare({
					modals,
					permissionsModel,
				})(XiomePermissions)
			),
	}
}
