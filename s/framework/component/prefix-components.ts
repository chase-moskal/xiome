
export function prefixComponents<xComponents extends {[key: string]: any}>(
		prefix: string,
		components: xComponents,
	): xComponents {

	const renamedComponents = {}

	for (const [key, value] of Object.entries(components))
		renamedComponents[prefix + key] = value

	return <xComponents>renamedComponents
}
