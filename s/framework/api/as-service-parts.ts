
import {ServiceParts} from "./types/service-parts.js"
import {Topic} from "renraku/x/types/primitives/topic.js"

export function asServiceParts<xMeta, xAuth>() {
	return function<xServiceParts extends ServiceParts<xMeta, xAuth, Topic<xAuth>>>(parts: xServiceParts) {
		return parts
	}
}
