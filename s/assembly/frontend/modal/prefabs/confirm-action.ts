import {Op, ops} from "../../../../framework/ops.js"
import {html} from "../../../../framework/component.js"
import {ModalSystem} from "../types/modal-system.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ConfirmActionOptions} from "../types/confirm-action-options.js"


export function prepareConfirmAction(
	popup: ModalSystem["popup"]
) {

	return async({
			title,
			message,
			loadingMessage,
			cancelButtonLabel = "no",
			confirmButtonLabel = "yes",
			actionWhenConfirmed,
		}: ConfirmActionOptions) => {
		let op: Op<void> = ops.ready(undefined)
		function setOp(newOp: Op<void>) {
			op = newOp
			modal.controls.rerender()
		}
		const modal = popup({
			focusNthElement: 1,
			renderContent: (controls) => {
				const isError = ops.isError(op)
				return html`
					<h2>${title}</h2>
					${renderOp(op,
						() => html`
							<div data-confirm>
								${message}
								<div data-buttons>
									<xio-button
										focusable
										data-button=yes
										data-vibe="positive"
										@press=${async() => {
										await ops.operation({
											promise: actionWhenConfirmed(),
											setOp,
										})
										controls.close()}}>
											${confirmButtonLabel}
									</xio-button>
									<xio-button
										focusable
										data-button=no
										data-vibe="neutral"
										@press=${controls.close}>
											${cancelButtonLabel}
									</xio-button>
								</div>
							</div>
						`,
						null,
						{loadingMessage}
						)}
					${isError
						? html `
						<div data-buttons>
							<xio-button
								focusable
								data-button=no
								data-vibe="neutral"
								@press=${controls.close}>
									ok
							</xio-button>
						</div>
						`
						: null
					}
				`
			},
			onBlanketClick: (controls) => {
				const isLoading = ops.isLoading(op)
				if(!isLoading)
					controls.close()
			}
		})
	}
}


// function confirmAction({
// 		title,
// 		message,
// 		cancelButtonLabel,
// 		confirmButtonLabel,
// 		actionWhenConfirmed,
// 	}: {
// 		actionWhenConfirmed: () => void
// 		message: string
// 		title: string
// 		confirmButtonLabel: string
// 		cancelButtonLabel: string
// 	}) {
		
// 	}
