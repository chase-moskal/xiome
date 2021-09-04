
import {trackingMechanics} from "./tracking-mechanics.js"

export type Reaction = () => void
export type Track = ReturnType<typeof trackingMechanics>["track"]

export type Readable<xState extends {}> = {
	readonly [P in keyof xState]: xState[P]
}
