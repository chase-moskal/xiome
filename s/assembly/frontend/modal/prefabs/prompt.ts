
import {html} from "../../../../framework/component.js"
import {ModalSystem} from "../types/modal-system.js"
import {ModalControls} from "../types/modal-controls.js"
import {XioTextInput} from "../../../../features/xio-components/inputs/xio-text-input.js"

export function preparePrompt(
		popup: ModalSystem["popup"]
	): ModalSystem["prompt"] {

	return async({
			title,
			input,
			body = null,
			yes = {label: "okay", vibe: "positive"},
			no = {label: "nevermind", vibe: "neutral"},
			focusNthElement = 1,
			blanketClickMeansCancel = true,
		}) => new Promise(resolve => {

		const xioTextInput: XioTextInput<any> =
			<any>document.createElement("xio-text-input")
		xioTextInput.textarea = input.textarea ?? false
		xioTextInput.parser = input.parser
		xioTextInput.validator = input.validator
		xioTextInput.textContent = input.label

		function hasProblems() {
			void xioTextInput.value
			return xioTextInput.problems.length !== 0
		}

		function getCurrentValue() {
			return hasProblems()
				? undefined
				: {value: xioTextInput.value}
		}

		function prepareFinishingMoves(controls: ModalControls) {
			return {
				yes: () => {
					const currentValue = getCurrentValue()
					if (!hasProblems()) {
						controls.close()
						resolve(currentValue)
					}
				},
				no: () => {
					controls.close()
					resolve(undefined)
				},
			}
		}

		const {controls, modal} = popup({
			focusNthElement,
			onBlanketClick: blanketClickMeansCancel
				? controls => {
					controls.close()
					resolve(undefined)
				}
				: () => {},
			renderContent: controls => {
				const finish = prepareFinishingMoves(controls)
				return html`
					<div data-confirm>
						${typeof title == "string" ? html`<h2>${title}</h2>` : title}
						${typeof body == "string" ? html`<p>${body}</p>` : body}
						${xioTextInput}
						<div data-buttons>
							<xio-button
								data-button=yes
								data-vibe=${yes.vibe}
								?disabled=${hasProblems()}
								@press=${finish.yes}>
									${yes.label}
							</xio-button>
							<xio-button
								data-button=no
								data-vibe=${no.vibe}
								@press=${finish.no}>
									${no.label}
							</xio-button>
						</div>
					</div>
				`
			},
		})

		const finish = prepareFinishingMoves(controls)

		xioTextInput.onvaluechange = () => controls.rerender()
		xioTextInput.onenterpress = () => finish.yes()
		modal.addEventListener("keyup", ({key}) => {
			if (key === "Escape")
				finish.no()
		})
	})
}
