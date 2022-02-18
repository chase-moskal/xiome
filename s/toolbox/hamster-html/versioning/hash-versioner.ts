
import {createHash} from "crypto"
import {readFile} from "fs/promises"
import {normalize, join} from "path"

export interface HashVersioner {
	(url: string): Promise<string>
}

export function hashVersioner({root, origin}: {
		root: string
		origin?: string
	}): HashVersioner {

	function getPathForUrl(url: string) {
		url = url.split("#")[0]
		url = url.split("?")[0]
		if (origin === undefined)
			return normalize(join(root, url[0] === "/" ?url.slice(1) :url))
		return (url[0] === "/")
			? normalize(join(root, url.slice(1)))
			: normalize(join(root, origin, url))
	}

	async function computeHash(path: string) {
		try {
			const file = await readFile(path, "utf-8")
			const hasher = createHash("sha256")
			hasher.update(file)
			return hasher.digest("hex")
		}
		catch (error) {
			throw new HashVersionerError(
				`file not found "${path}"`
			)
		}
	}

	return async function v(url: string) {
		const path = getPathForUrl(url)
		const hash = await computeHash(path)
		const query = url.match(/\?(.+)$/)
		const tag = `v=${hash}`
		return normalize(
			query
				? url + "&" + tag
				: url + "?" + tag
		)
	}
}

export class HashVersionerError extends Error {
	name = this.constructor.name
	constructor(message: string) {
		super(message)
	}
}
