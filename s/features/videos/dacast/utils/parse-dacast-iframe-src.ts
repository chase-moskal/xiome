
const dacastIframeRegex = /"(https:\/\/iframe\.dacast\.com\/(\S+)\/(\S+))"/i

export function parseDacastIframeSrc(code: string) {
	const parts = code.match(dacastIframeRegex)
	if (!parts)
		throw new Error(`failed to parse dacast iframe embed code: make-dacast-iframe likely needs to be updated`)

	const [,, resource, id] = parts

	const fixedResource = resource === "playlists"
		? "playlist"
		: resource

	return `https://iframe.dacast.com/${fixedResource}/${id}`
}
