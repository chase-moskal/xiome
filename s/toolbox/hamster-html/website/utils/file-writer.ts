
import {join, dirname} from "path"
import {writeFile, mkdir} from "fs/promises"

import {HtmlTemplate} from "../../html.js"

export function makeFileWriter(root: string) {
	return {
		async write(path: string, html: HtmlTemplate) {
			const path2 = join(root, path)
			await mkdir(dirname(path2), {recursive: true})
			return writeFile(path2, html.toString(), "utf-8")
		}
	}
}
