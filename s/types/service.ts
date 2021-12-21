
import * as renraku from "renraku"

export type Service<
	xServiceMaker extends (...args: any[]) => renraku.Service<any, any, any>
> = renraku.Remote<ReturnType<xServiceMaker>>
