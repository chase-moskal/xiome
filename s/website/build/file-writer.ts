
import {join} from "path"
import {writeFile} from "fs/promises"
import {HtmlTemplate} from "../../toolbox/hamster-html/html.js"

export function makeFileWriter(root: string) {
	return {
		async write(path: string, html: HtmlTemplate) {
			return writeFile(join(root, path), html.toString(), "utf-8")
		}
	}
}
