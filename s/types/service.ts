
import {Remote} from "renraku/x/types/remote/remote.js"
import {ApiContext} from "renraku/x/types/api/api-context.js"

export type Service<T extends (...args: any[]) => ApiContext<any, any, any, any>> =
	Remote<ReturnType<T>>
