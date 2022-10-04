
export function makeSecretMockCommandSystem() {
	let commandId = 0
	const waitingForResponses = new Map<number, () => void>()

	window.addEventListener("message", event => {
		const isFromParent = event.source === window.opener
		const isSecretMockCommand = event.data.secretMockCommand === true
		if (isFromParent && isSecretMockCommand) {
			const resolve = waitingForResponses.get(event.data.commandId) ?? (() => {})
			resolve()
		}
	})

	return {
		async postCommand(type: string) {
			const currentCommandId = commandId++
			window.opener.postMessage({
				type,
				commandId: currentCommandId,
				secretMockCommand: true,
			}, "*")
			return new Promise<void>(
				resolve => waitingForResponses.set(currentCommandId, resolve)
			)
		}
	}
}
