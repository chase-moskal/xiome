
import {HashVersioner} from "../versioning/hash-versioner.js"

export interface WebsiteContext {
	base: string
	v: HashVersioner
}
