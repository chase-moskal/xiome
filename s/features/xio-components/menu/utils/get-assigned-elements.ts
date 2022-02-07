
export function getAssignedElements<E extends HTMLElement>(
		slot: HTMLSlotElement
	) {

	return <E[]>Array.from(slot.assignedNodes())
		.filter(node => node instanceof HTMLElement)
}
