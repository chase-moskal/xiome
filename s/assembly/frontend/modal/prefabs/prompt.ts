
import {html} from "lit-html"
import {ModalSystem} from "../types/modal-system.js"

export function preparePrompt(popup: ModalSystem["popup"]): ModalSystem["prompt"] {
	return async({
			input,
			title,
			body = null,
			yes = {label: "okay", vibe: "positive"},
			no = {label: "nevermind", vibe: "neutral"},
			focusNthElement = 1,
			blanketClickMeansNo = true,
		}) => new Promise<{}>(resolve => {
		console.warn("TODO implement")
		popup({
			focusNthElement,
			onBlanketClick: blanketClickMeansNo
				? controls => {
					controls.close()
					resolve(false)
				}
				: () => {},
			renderContent: controls => {
				const onYes = () => { controls.close(); resolve(true) }
				const onNo = () => { controls.close(); resolve(false) }
				return html`
					<div data-confirm>
						${typeof title == "string" ? html`<h2>${title}</h2>` : title}
						${typeof body == "string" ? html`<p>${body}</p>` : body}
						<div data-buttons>
							<xio-button data-button=yes @press=${onYes}>${yes}</xio-button>
							<xio-button data-button=no @press=${onNo}>${no}</xio-button>
						</div>
					</div>
				`
			},
		})
	})
}
