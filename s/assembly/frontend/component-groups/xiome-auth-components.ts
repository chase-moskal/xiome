
import {share2} from "../../../framework/component.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {XiomeAppManager} from "../../../features/auth/components/apps/xiome-app-manager.js"
import {XiomeMyAvatar} from "../../../features/auth/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "../../../features/auth/components/my-account/xiome-my-account.js"
import {XiomeLoginPanel} from "../../../features/auth/components/login-panel/xiome-login-panel.js"
import {XiomePermissions} from "../../../features/auth/components/permissions/xiome-permissions.js"

export function xiomeAuthComponents({models, modals}: XiomeComponentOptions) {
	const {authModel, appModel, personalModel, permissionsModel} = models
	return {
		XiomeMyAvatar: share2(XiomeMyAvatar, {authModel}),
		XiomeLoginPanel: share2(XiomeLoginPanel, {authModel}),
		XiomeAppManager: share2(XiomeAppManager, {appModel, modals}),
		XiomeMyAccount: share2(XiomeMyAccount, {authModel, personalModel}),
		XiomePermissions: share2(XiomePermissions, {authModel, modals, permissionsModel}),
	}
}
