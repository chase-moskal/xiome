
import {mixinShare, mixinMadstateSubscriptions} from "../../../framework/component/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

import {XiomeAppManager} from "./apps/components/app-manager/xiome-app-manager.js"

import {XiomeMyAvatar} from "./users/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "./users/components/my-account/xiome-my-account.js"
import {XiomeLoginPanel} from "./users/components/login-panel/xiome-login-panel.js"

import {XiomePrivileges} from "./permissions/components/privileges/xiome-privileges.js"
import {XiomePermissions} from "./permissions/components/permissions/xiome-permissions.js"

export function integrateAuthComponents({models, modals}: XiomeComponentOptions) {
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
		XiomePrivileges:
			mixinMadstateSubscriptions(permissionsModel.subscribe)(
				mixinShare({
					modals,
					permissionsModel,
				})(XiomePrivileges)
			),
	}
}
