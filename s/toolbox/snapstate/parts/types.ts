
import {trackingMechanics} from "./tracking-mechanics.js"

export type Observer<xState, X> = (readable: Readable<xState>) => X
export type Reaction<X> = (x: X) => void

export type Track = ReturnType<typeof trackingMechanics>["track"]

export type Readable<xState extends {}> = {
	readonly [P in keyof xState]: xState[P]
}
