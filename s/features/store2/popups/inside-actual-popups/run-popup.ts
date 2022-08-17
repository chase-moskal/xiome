
import {parseSearchParams} from "./parse-search-params.js"
import {assignClickHandlers} from "./assign-click-handlers.js"
import {makeSecretMockCommandSystem} from "./secret-command-system.js"

const routines = {

	async "connect"() {
		const {return_url, refresh_url} = parseSearchParams()
		const commandSystem = makeSecretMockCommandSystem()
		assignClickHandlers({
			async "button.complete"() {
				await commandSystem.postCommand("complete")
				window.location.href = return_url
			},
			async "button.incomplete"() {
				await commandSystem.postCommand("incomplete")
				window.location.href = return_url
			},
			async "button.cancel"() {
				window.location.href = refresh_url
			},
		})
	},

	async "login"() {
		const commandSystem = makeSecretMockCommandSystem()
		assignClickHandlers({
			async "button.complete"() {
				await commandSystem.postCommand("complete")
				window.close()
			},
			async "button.incomplete"() {
				await commandSystem.postCommand("incomplete")
				window.close()
			},
			async "button.cancel"() {
				window.close()
			},
		})
	},

	async "checkout"() {
		const {success_url, cancel_url} = parseSearchParams()
		const commandSystem = makeSecretMockCommandSystem()
		assignClickHandlers({
			async "button.success"() {
				await commandSystem.postCommand("success")
				window.location.href = success_url
			},
			async "button.failure"() {
				await commandSystem.postCommand("success")
				window.location.href = success_url
			},
			async "button.cancel"() {
				window.location.href = cancel_url
			},
		})
	},

	async "checkout-payment-method"() {
		const {success_url, cancel_url} = parseSearchParams()
		const commandSystem = makeSecretMockCommandSystem()
		assignClickHandlers({
			async "button.success"() {
				await commandSystem.postCommand("success")
				window.location.href = success_url
			},
			async "button.failure"() {
				await commandSystem.postCommand("failure")
				window.location.href = cancel_url
			},
			async "button.cancel"() {
				window.location.href = cancel_url
			},
		})
	},
}

const type = window.location.pathname.split("/").pop()
routines[type]()
