
import {promises} from "fs"
import yaml from "js-yaml-chase-esm/dist/js-yaml.esm.js"

export const read = (path: string): Promise<string> =>
	promises.readFile(path, "utf8")

export const readYaml = async<T>(path: string): Promise<T> => yaml.safeLoad(
	await promises.readFile(path, "utf8")
)
