
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
		permissionsLoading: loading<PermissionsDisplay>(),
	})

	const actions = mobxify({
		async load() {
			if (await getAccess()) {
				await state.permissionsLoading.actions.setLoadingUntil({
					promise: permissionsService.fetchPermissions(),
					errorReason: "error loading permissions",
				})
			}
		},
	})

	const load = onesie(actions.load)

	return mobxify({
		load,
		get permissionsLoadingView() {
			return state.permissionsLoading.view
		},
		async accessChange() {
			await actions.load()
		},
	})
}
