
import {ops} from "../../../../../../framework/ops.js"
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

	const {id_app} = app
	const load = (firstStep: Promise<any> = Promise.resolve(undefined)) => (
		ops.operation({
			promise: firstStep
				.then(() => manageAdminsService.listAdmins({id_app})),
			setOp: admins => actions.setAdmins(admins)
		})
	)

	async function listAdmins() {
		await load()
	}

	async function assignAdmin() {
		const {email} = state.assignerDraft
		actions.setAssignerDraft({email: undefined})
		await load(manageAdminsService.assignAdmin({id_app, email}))
	}

	async function revokeAdmin(userId: string) {
		await load(manageAdminsService.revokeAdmin({id_app, userId}))
	}

	return {listAdmins, assignAdmin, revokeAdmin}
}
