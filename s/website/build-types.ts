
import {HashVersioner} from "../toolbox/hamster-html/versioning/hash-versioner.js"
import {WebsiteContext} from "../toolbox/hamster-html/website/build-website-types.js"

export interface XiomeWebsiteContext extends WebsiteContext {
	mode: "mock" | "local" | "production"
	v: HashVersioner
}
