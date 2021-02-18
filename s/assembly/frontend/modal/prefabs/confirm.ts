
import {html} from "lit-html"
import {ModalSystem} from "../types/modal-system.js"

export function prepareConfirm(popup: ModalSystem["popup"]) {
	return async({
			title,
			body = null,
			yes = "yes",
			no = "no",
		}) => new Promise<boolean>(resolve => {
		popup({
			onBlanketClick: controls => {
				controls.close()
				resolve(false)
			},
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
