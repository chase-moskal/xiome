
import {ConstructorFor} from "./constructor-for.js"

export type Mixin<C extends ConstructorFor, T extends {}> =
	new (...args: ConstructorParameters<C>) =>
		InstanceType<C> & T
