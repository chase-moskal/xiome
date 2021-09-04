
export type Reaction = () => void

export type Readable<xState extends {}> = {
	readonly [P in keyof xState]: xState[P]
}
