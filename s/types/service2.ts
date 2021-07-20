
import {Remote} from "renraku/x/types/remote/remote.js"
import {ApiContext} from "renraku/x/types/api/api-context.js"

export type Service2<T extends (...args: any[]) => ApiContext<any, any, any, any>> =
	Remote<ReturnType<T>>
	// Business<ReturnType<T>>
