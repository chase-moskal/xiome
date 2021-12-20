
import {RenrakuRemote, RenrakuService} from "renraku"

export type Service<
	xServiceMaker extends (...args: any[]) => RenrakuService<any, any, any>
> = RenrakuRemote<ReturnType<xServiceMaker>>
