
import {AccessPayload} from "../auth-types.js"
import {onesie} from "../../../toolbox/onesie.js"
import {mobxify} from "../../../framework/mobxify.js"
import {loading} from "../../../framework/loading/loading.js"
import {PermissionsDisplay} from "../topics/permissions/types/permissions-display.js"
import {PermissionsModelOptions} from "./types/permissions/permissions-model-options.js"

export function makePermissionsModel({
		getAccess,
		permissionsService,
	}: PermissionsModelOptions) {

	const state = mobxify({
		active: false,
		permissionsLoading: loading<PermissionsDisplay>(),
	})

	const actions = mobxify({
		reload: onesie(async() => {
			if (await getAccess()) {
				await state.permissionsLoading.actions.setLoadingUntil({
					promise: permissionsService.fetchPermissions(),
					errorReason: "error loading permissions",
				})
			}
		}),
		async load() {
			state.active = true
			actions.reload()
		},
		deactivate() {
			state.active = false
		},
	})

	return {
		load: actions.load,
		deactivate: actions.deactivate,
		get permissionsLoadingView() {
			return state.permissionsLoading.view
		},
		async accessChange(access: AccessPayload) {
			if (state.active && access) {
				await actions.reload()
			}
		},
	}
}
