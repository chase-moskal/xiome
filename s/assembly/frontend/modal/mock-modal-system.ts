import {ModalSystem} from "./types/modal-system.js"

export function mockModalSystem() {

	const nextModalResults = {
		confirm: true,
		prompt: "",
	}

	const modals: ModalSystem = {
		popup() {
			return {
				close() {},
			}
		},
		async confirm() {
			return nextModalResults.confirm
		},
		async prompt() {
			return nextModalResults.prompt
		},
	}

	return {
		modals,
		nextModalResults,
	}
}
