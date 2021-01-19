
import {Topic} from "renraku/x/types/primitives/topic.js"
import {Business} from "renraku/x/types/primitives/business.js"

export type Service<T extends (...args: any[]) => Topic<any>> =
	Business<ReturnType<T>>
