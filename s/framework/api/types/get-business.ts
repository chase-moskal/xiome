
import {ServiceParts} from "./service-parts.js"
import {Business} from "renraku/x/types/primitives/business.js"

export type GetBusiness<
		xServicePartMaker extends (...args: any[]) => ServiceParts<any, any, any>
	> = Business<ReturnType<xServicePartMaker>["expose"]>
