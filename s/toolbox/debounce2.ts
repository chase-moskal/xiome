
export function debounce2<xAction extends (...args: any[]) => void>(
		delay: number,
		action: xAction
	): xAction {

	let latestArgs: any[]
	let timeout: any

	return <xAction>((...args) => {
		latestArgs = args
		if (!timeout) {
			const operation = () => {
				action(...latestArgs)
				timeout = undefined
			}
			timeout = setTimeout(operation, delay)
		}
	})
}
