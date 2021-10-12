
import {html} from "../../../../framework/component.js"
import {ModalSystem} from "../types/modal-system.js"

export function prepareConfirm(
		popup: ModalSystem["popup"]
	): ModalSystem["confirm"] {

	return async({
			title,
			body = null,
			yes = {label: "yes", vibe: "positive"},
			no = {label: "no", vibe: "neutral"},
			focusNthElement = 1,
			blanketClickMeansNo = true,
		}) => new Promise<boolean>(resolve => {

		popup({

			focusNthElement,

			onBlanketClick: blanketClickMeansNo
				? controls => {
					controls.close()
					resolve(false)
				}
				: () => {},

			renderContent: controls => {
				const onYes = () => {
					controls.close()
					resolve(true)
				}
				const onNo = () => {
					controls.close()
					resolve(false)
				}
				return html`
					<div data-confirm>
						${typeof title == "string" ? html`<h2>${title}</h2>` : title}
						${typeof body == "string" ? html`<p>${body}</p>` : body}
						<div data-buttons>
							<xio-button
								focusable
								data-button=yes
								data-vibe="${yes.vibe}"
								@press=${onYes}>
									${yes.label}
							</xio-button>
							${no ? html`
								<xio-button
									focusable
									data-button=no
									data-vibe="${no.vibe}"
									@press=${onNo}>
										${no.label}
								</xio-button>
							` : null}
						</div>
					</div>
				`
			},
		})
	})
}
