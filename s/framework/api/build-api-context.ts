
import {ServiceParts} from "./types/service-parts.js"
import {Topic} from "renraku/x/types/primitives/topic.js"
import {assembleApiContext} from "./assemble-api-context.js"

export function buildApiContext<xMeta, xAuth>() {
	return function<xTopic extends Topic<xAuth>>(
			parts: ServiceParts<xMeta, xAuth, xTopic>
		) {
		return assembleApiContext<xMeta, xAuth, xTopic>(parts)
	}
}
