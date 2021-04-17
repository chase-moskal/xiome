
export type Action<xReducer extends Reducer<any>> =
	(...args: DropFirst<Parameters<xReducer>>) => void

export type Reducers<xState> = {[key: string]: Reducer<xState>}

export interface StateWranglerOptions<xState> {
	initial: xState
	render: (state: xState) => void
	debug?: (...args: any[]) => void
}

type DropFirst<T extends unknown[]> =
	T extends [any, ...infer U]
		? U
		: never

type Reducer<xState> = (state: xState, ...args: any[]) => xState
