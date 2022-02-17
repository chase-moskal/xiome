
import {createHash} from "crypto"
import {readFile} from "fs/promises"
import {normalize, join} from "path"

export interface HashVersioner {
	(url: string): Promise<string>
}

export function hashVersioner({root}: {root: string}): HashVersioner {

	function getPathForUrl(url: string) {
		[url] = url.split("#")
		[url] = url.split("?")
		return normalize(join(root, url))
	}

	async function computeHash(path: string) {
		const file = await readFile(path, "utf-8")
		const hasher = createHash("sha256")
		hasher.update(file)
		return hasher.digest("hex")
	}

	return async function v(url: string) {
		const path = getPathForUrl(url)
		const hash = await computeHash(path)
		const query = url.match(/\?(.+)$/)
		const tag = `v=${hash}`
		return query
			? url + "&" + tag
			: url + "?" + tag
	}
}
