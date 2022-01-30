
import {AppDisplay} from "../../../types/app-display.js"
import {Service} from "../../../../../../../types/service.js"
import {html} from "../../../../../../../framework/component.js"
import {emailValidator} from "../../../utils/admin-email-validator.js"
import {makeAppEditService} from "../../../services/app-edit-service.js"
import {adminManagerControls} from "./aspects/admin-manager-controls.js"
import {renderOp} from "../../../../../../../framework/op-rendering/render-op.js"
import {XioTextInput} from "../../../../../../xio-components/inputs/xio-text-input.js"
import {adminManagerStateAndActions} from "./aspects/admin-manager-state-and-actions.js"
import {ValueChangeEvent} from "../../../../../../xio-components/inputs/events/value-change-event.js"

export function makeAdminManager({app, appEditService, query}: {
		app: AppDisplay
		appEditService: Service<typeof makeAppEditService>
		query: <E extends HTMLElement>(selector: string) => E
	}) {

	const {state, actions, subscribe} = adminManagerStateAndActions()
	const controls = adminManagerControls({
		app,
		state,
		actions,
		appEditService,
	})

	function handleEmailChange(event: ValueChangeEvent<string>) {
		const email = event.detail.value ?? undefined
		actions.setAssignerDraft({email})
	}

	function handleAssignButtonPress() {
		const textInput = query<XioTextInput>(".adminassigner xio-text-input")
		controls.assignAdmin()
		textInput.text = ""
	}

	function renderAdminAssigner() {
		const exportPartsTextInput = `
			label: xiotextinput-label,
			textinput: xiotextinput-textinput,
			problems: xiotextinput-problems,

			label: adminmanager-xiotextinput-label,
			textinput: adminmanager-xiotextinput-textinput,
			problems: adminmanager-xiotextinput-problems,
		`
		return html`
			<div class=adminassigner>
				<xio-text-input
					part=adminmanager-xiotextinput
					exportparts="${exportPartsTextInput}"
					.validator=${emailValidator}
					@valuechange=${handleEmailChange}>
						email
				</xio-text-input>
				<xio-button
					?disabled=${!state.assignerDraft.email}
					@press=${handleAssignButtonPress}>
						grant
				</xio-button>
			</div>
		`
	}

	function renderAdminList() {
		return html`
			<div class=adminlist>
				${renderOp(state.admins, admins => html`
					<ul>
						${admins.map(({email, userId}) => html`
							<li>
								<span>${email}</span>
								<xio-button @press=${() => controls.revokeAdmin(userId)}>
									revoke
								</xio-button>
							</li>
						`)}
					</ul>
				`)}
			</div>
		`
	}

	function render() {
		return html`
			${renderAdminAssigner()}
			${renderAdminList()}
		`
	}

	return {render, controls, subscribe}
}
