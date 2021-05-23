
import {Service} from "../../../../../types/service.js"
import {AppDisplay} from "../../../types/apps/app-display.js"
import {html} from "../../../../../framework/component2/component2.js"
import {manageAdminsTopic} from "../../../topics/manage-admins-topic.js"
import {adminManagerControls} from "./aspects/admin-manager-controls.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {emailValidator} from "../../../topics/apps/admin-email-validator.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"
import {adminManagerStateAndActions} from "./aspects/admin-manager-state-and-actions.js"
import {ValueChangeEvent} from "../../../../xio-components/inputs/events/value-change-event.js"

export function makeAdminManager({app, manageAdminsService, query}: {
		app: AppDisplay
		manageAdminsService: Service<typeof manageAdminsTopic>
		query: <E extends HTMLElement>(selector: string) => E
	}) {

	const {state, actions, track} = adminManagerStateAndActions()
	const controls = adminManagerControls({
		app,
		state,
		actions,
		manageAdminsService,
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

	return {render, controls, track}
}
