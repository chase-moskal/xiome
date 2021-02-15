
import {Service} from "../../../../../../types/service.js"
import {AppDisplay} from "../../../../types/apps/app-display.js"
import {manageAdminsTopic} from "../../../../topics/manage-admins-topic.js"
import {adminManagerStateAndActions} from "./admin-manager-state-and-actions.js"

export function adminManagerControls({
		app,
		state,
		actions,
		manageAdminsService
	}: {
		app: AppDisplay
		manageAdminsService: Service<typeof manageAdminsTopic>
		state: ReturnType<typeof adminManagerStateAndActions>["state"]
		actions: ReturnType<typeof adminManagerStateAndActions>["actions"]
	}) {

	const {appId} = app

	async function listAdmins() {
		await actions.adminsLoadingActions.setLoadingUntil({
			errorReason: "failed loading admins",
			promise: manageAdminsService.listAdmins({appId}),
		})
	}

	async function assignAdmin() {
		const {email} = state.assignerDraft
		actions.setAssignerDraft({email: undefined})
		await actions.adminsLoadingActions.setLoadingUntil({
			errorReason: "failed assigned admin",
			promise: manageAdminsService.assignAdmin({appId, email})
				.then(() => manageAdminsService.listAdmins({appId})),
		})
	}

	async function revokeAdmin(userId: string) {
		await actions.adminsLoadingActions.setLoadingUntil({
			errorReason: "failed to revoke admin",
			promise: manageAdminsService.revokeAdmin({appId, userId})
				.then(() => manageAdminsService.listAdmins({appId})),
		})
	}

	return {listAdmins, assignAdmin, revokeAdmin}
}
