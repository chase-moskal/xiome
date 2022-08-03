
import {Id} from "dbmage"
import {centeredPopupFeatures} from "../../../toolbox/popups/centered-popup-features.js"

export interface SecretMockCommand {
	secretMockCommand: true
	commandId: number
	type: string
}

export interface SecretMockResponse {
	secretMockCommand: true
	commandId: number
}

export interface PopupParameters {
	url: string
	popupId: string
	width?: number
	height?: number
	handleSecretMockCommand?(command: SecretMockCommand): Promise<void>,
}

export interface PopupResult {
	popupId: string
}

export namespace popupCoordinator {

	export async function openPopupAndWaitForResult<xResult extends PopupResult>({
			url,
			width = 260,
			height = 260,
			popupId,
			handleSecretMockCommand = async() => {},
		}: PopupParameters): Promise<xResult> {

		// TODO
		// - message origin checking should work properly

		const popup = window.open(url, "_blank", centeredPopupFeatures(width, height))

		return new Promise<xResult | undefined>(resolve => {
			function finish(result: xResult | undefined) {
				clearInterval(interval)
				window.removeEventListener("message", handleMessage)
				resolve(result)
			}
			function handleMessage(event: MessageEvent<any>) {
				const isFromSafeOrigin = event.origin === window.origin
				const isMatchingPopupId = event.data?.popupId === popupId
				const isSecretMockCommand = event.data.secretMockCommand === true

				if (isFromSafeOrigin) {
					if (isSecretMockCommand)
						handleSecretMockCommand(event.data).then(() => {
							popup.postMessage(<SecretMockResponse>{
								secretMockCommand: true,
								commandId: event.data.commandId,
							}, "*")
						})
					else if (isMatchingPopupId)
						finish(event.data)
					else
						console.error(`ignoring message for other popup "${event.data.popupId}":`, event.data)
				}
				else
					console.error(`ignoring message from origin "${event.origin}":`, event.data)
			}
			window.addEventListener("message", handleMessage)
			const interval = setInterval(() => {
				if (popup.closed)
					finish(undefined)
			}, 100)
		})
	}

	function encodeQuerystring(result: any) {
		const searchParams = new URLSearchParams({...result})
		return searchParams.toString()
	}

	interface PopupInfoParams {
		popupReturnUrl: string
		generateId: () => Id
	}

	export function makePopupInfoForStripeConnect({
			popupReturnUrl,
			generateId,
		}: PopupInfoParams) {
		const popupId = generateId().string
		console.log("POPUPID", popupId)
		return {
			popupId,
			return_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "return",
			})}`,
			refresh_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "refresh",
			})}`,
		}
	}

	export function makePopupInfoForStripeCheckout({
			popupReturnUrl,
			generateId,
		}: PopupInfoParams) {
		const popupId = generateId().string
		return {
			popupId,
			success_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "success",
			})}`,
			cancel_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "cancel",
			})}`,
		}
	}
}
