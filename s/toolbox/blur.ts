
export function blurActiveElement() {
	const activeElement = <HTMLElement>document.activeElement
	if (activeElement)
		activeElement.blur()
}
