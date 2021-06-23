
import {Blueprint} from "../types/blueprint.js"
import {objectMap2} from "../../../toolbox/object-map.js"

function processBlueprintRecursive({
		blueprint,
		path = [],
		process,
	}: {
		blueprint: Blueprint
		path?: string[]
		process: (path: string[]) => any
	}) {
	
	return objectMap2(
		blueprint,
		(value, key) => (
			value === true
				? process([...path, key])
				: processBlueprintRecursive({
					blueprint: value,
					path: [...path, key],
					process,
				})
		),
	)
}

type ProcessedBlueprint<xBlueprint extends Blueprint, xValue> = {
	[P in keyof xBlueprint]: xBlueprint[P] extends true
		? xValue
		: xBlueprint[P] extends Blueprint
			? ProcessedBlueprint<xBlueprint[P], xValue>
			: never
}

export function processBlueprint<xBlueprint extends Blueprint, xValue>({blueprint, process}: {
		blueprint: xBlueprint
		process: (path: string[]) => xValue
	}): ProcessedBlueprint<xBlueprint, xValue> {
	return processBlueprintRecursive({blueprint, process})
}
