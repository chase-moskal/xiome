
import {Api, AddMetaApi} from "renraku/dist/types.js"

export {Api, Topic} from "renraku/dist/types.js"
export * from "./types/fancy.js"
export * from "./features/auth/auth-types.js"

export type GetApi<A extends Api> = (accessToken: string) => AddMetaApi<A>

