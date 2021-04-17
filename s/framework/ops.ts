
export namespace Ops {
	export enum Mode {
		None,
		Loading,
		Error,
		Ready,
	}

	export interface None {
		mode: Ops.Mode.None
	}

	export interface Loading {
		mode: Ops.Mode.Loading
	}

	export interface Error {
		mode: Ops.Mode.Error
		reason: string
	}

	export interface Ready<xValue> {
		mode: Ops.Mode.Ready
		value: xValue
	}
}

export type Op<xValue> =
	| Ops.None
	| Ops.Loading
	| Ops.Error
	| Ops.Ready<xValue>

export const ops = {
	none: (): Ops.None => ({
		mode: Ops.Mode.None,
	}),
	loading: (): Ops.Loading => ({
		mode: Ops.Mode.Loading,
	}),
	error: (reason: string): Ops.Error => ({
		mode: Ops.Mode.Error,
		reason,
	}),
	ready: <xValue>(value: xValue): Ops.Ready<xValue> => ({
		mode: Ops.Mode.Ready,
		value,
	}),
	select: <xValue>(op: Op<xValue>, options: {
			none: () => void
			loading: () => void
			error: (reason: string) => void
			ready: (value: xValue) => void
		}) => {
		switch (op.mode) {
			case Ops.Mode.None: return options.none()
			case Ops.Mode.Loading: return options.loading()
			case Ops.Mode.Error: return options.error(op.reason)
			case Ops.Mode.Ready: return options.ready(op.value)
		}
	},
}
