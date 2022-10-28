
export function parseSpecifiedPlans(plans: string) {
	return [
		...(plans ?? "")?.match(/(\w+)/g) ?? []
	]
}
