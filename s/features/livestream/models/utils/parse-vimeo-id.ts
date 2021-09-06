
import {isUrl, validateVimeoId} from "../../api/validation/livestream-validators.js"

export function parseVimeoId(field: string) {

	const vimeoId = isUrl(field)
		? new URL(field).pathname.slice(1)
		: field
	
	const problems = validateVimeoId(vimeoId)

	if (!problems.length)
		return field
	else
		throw new Error("invalid vimeo id")
}
