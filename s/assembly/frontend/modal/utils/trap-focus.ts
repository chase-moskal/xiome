
export function trapFocus(element: HTMLElement) {

	const focusable = Array.from(element.querySelectorAll<HTMLElement>(`[tabindex]:not([disabled]), a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])`))

	const firstFocusable = focusable[0]
	const lastFocusable = focusable[focusable.length - 1]

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
