
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
	const load = (promise: Promise<any> = Promise.resolve(undefined)) => (
		actions.adminsLoadingActions.setLoadingUntil({
			errorReason: "error in admin management",
			promise: promise
				.then(() => manageAdminsService.listAdmins({appId})),
		})
	)

	async function listAdmins() {
		await load()
	}

	async function assignAdmin() {
		const {email} = state.assignerDraft
		actions.setAssignerDraft({email: undefined})
		await load(manageAdminsService.assignAdmin({appId, email}))
	}

	async function revokeAdmin(userId: string) {
		await load(manageAdminsService.revokeAdmin({appId, userId}))
	}

	return {listAdmins, assignAdmin, revokeAdmin}
}
