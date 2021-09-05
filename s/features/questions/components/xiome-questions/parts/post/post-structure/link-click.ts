
export function linkClick(handler: () => void) {
	return (event: MouseEvent) => {
		event.preventDefault()
		handler()
	}
}
