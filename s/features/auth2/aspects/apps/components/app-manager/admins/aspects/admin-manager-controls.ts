
import {AppDisplay} from "../../../../types/app-display.js"
import {ops} from "../../../../../../../../framework/ops.js"
import {Service} from "../../../../../../../../types/service.js"
import {makeAppEditService} from "../../../../services/app-edit-service.js"
import {adminManagerStateAndActions} from "./admin-manager-state-and-actions.js"

export function adminManagerControls({
		app,
		state,
		actions,
		appEditService,
	}: {
		app: AppDisplay
		appEditService: Service<typeof makeAppEditService>
		state: ReturnType<typeof adminManagerStateAndActions>["state"]
		actions: ReturnType<typeof adminManagerStateAndActions>["actions"]
	}) {

	const {appId} = app
	const load = (firstStep: Promise<any> = Promise.resolve(undefined)) => (
		ops.operation({
			promise: firstStep
				.then(() => appEditService.listAdmins({appId})),
			setOp: admins => actions.setAdmins(admins)
		})
	)

	async function listAdmins() {
		await load()
	}

	async function assignAdmin() {
		const {email} = state.assignerDraft
		actions.setAssignerDraft({email: undefined})
		await load(appEditService.assignAdmin({appId, email}))
	}

	async function revokeAdmin(userId: string) {
		await load(appEditService.revokeAdmin({appId, userId}))
	}

	return {listAdmins, assignAdmin, revokeAdmin}
}
