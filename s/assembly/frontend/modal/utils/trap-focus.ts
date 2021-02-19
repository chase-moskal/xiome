
export function trapFocus(element: HTMLElement, focusNth: number) {
	const blueprint = `
		[focusable]:not([disabled])
		[tabindex]:not([disabled])
		a[href]:not([disabled])
		button:not([disabled])
		textarea:not([disabled])
		input[type="text"]:not([disabled])
		input[type="radio"]:not([disabled])
		input[type="checkbox"]:not([disabled])
		select:not([disabled])
	`
	const selector = blueprint
		.split("\n")
		.map(l => l.trim())
		.filter(l => l.length)
		.join(", ")

	const focusable = Array.from(element.querySelectorAll<HTMLElement>(selector))

	if (focusable.length === 0)
		throw new Error("cannot trap focus: no focusable element")

	const firstFocusable = focusable[0]
	const lastFocusable = focusable[focusable.length - 1]
	const nthFocusable = focusable[focusNth - 1]

	setTimeout(() => nthFocusable.focus(), 0)

	element.onkeydown = event => {
		if (event.key === "Tab") {
			if (event.shiftKey) {
				if (document.activeElement === firstFocusable) {
					lastFocusable.focus()
					event.preventDefault()
				}
			}
			else {
				if (document.activeElement === lastFocusable) {
					firstFocusable.focus()
					event.preventDefault()
				}
			}
		}
	}
}
