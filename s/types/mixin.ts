
import {Constructor} from "./constructor.js"

export type Mixin<C extends Constructor, T extends {}> =
	new (...args: ConstructorParameters<C>) =>
		InstanceType<C> & T
