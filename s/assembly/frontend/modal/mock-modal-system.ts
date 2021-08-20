
import {ModalSystem} from "./types/modal-system.js"

export function mockModalSystem() {

	const nextModalResults: {
			confirm: boolean
			prompt: undefined | {value: any}
		} = {
		confirm: true,
		prompt: undefined,
	}

	const modals: ModalSystem = {
		popup() {
			return {
				controls: {
					close() {},
					rerender() {},
				},
				modal: <any>{},
			}
		},
		async alert() {},
		async confirm() {
			return nextModalResults.confirm
		},
		async prompt<xValue>() {
			return <undefined | {value: xValue}>nextModalResults.prompt
		},
	}

	return {
		modals,
		nextModalResults,
	}
}
