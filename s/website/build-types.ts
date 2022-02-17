
import {HashVersioner} from "../toolbox/hamster-html/versioning/hash-versioner.js"

export interface BuildOptions {
	base: string
}

export interface CommonBuildOptions extends BuildOptions {
	mode: "mock" | "local" | "production"
	v: HashVersioner
}
