
import {Querystrings} from "../types.js"
import {parseSearchParams} from "./parse-search-params.js"
import {assignClickHandlers} from "./assign-click-handlers.js"
import {makeSecretMockCommandSystem} from "./secret-command-system.js"

const routines = {

	async "connect"() {
		const {return_url, refresh_url} = parseSearchParams<Querystrings.Connect>()
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
		const {success_url, cancel_url} = parseSearchParams<Querystrings.Checkout>()
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

	async "store-customer-portal"() {
		const commandSystem = makeSecretMockCommandSystem()
		assignClickHandlers({
			async "button.success"() {
				await commandSystem.postCommand("success")
				window.close()
			},
			async "button.failure"() {
				await commandSystem.postCommand("failure")
				window.close()
			},
			async "button.detach"() {
				await commandSystem.postCommand("detach")
				window.close()
			},
			async "button.cancel"() {
				window.close()
			},
		})
	},
}

const type = window.location.pathname.split("/").pop()
routines[type]()
