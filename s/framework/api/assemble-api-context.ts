
import {ServiceParts} from "./types/service-parts.js"
import {apiContext} from "renraku/x/api/api-context.js"
import {Topic} from "renraku/x/types/primitives/topic.js"

export function assembleApiContext<xMeta, xAuth, xTopic extends Topic<xAuth>>(
		parts: ServiceParts<xMeta, xAuth, xTopic>
	) {
	return apiContext<xMeta, xAuth>()({
		policy: {processAuth: parts.policy},
		expose: parts.expose,
	})
}
